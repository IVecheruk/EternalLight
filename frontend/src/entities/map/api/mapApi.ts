import type { MapDataResponse, MapLoadParams, MapPoint, MapPointStatus } from "../model/types";

/**
 * Центр Барнаула (примерно)
 */
const BARNAUL_CENTER = {
    lat: 53.3474,
    lng: 83.7788,
};

/**
 * Радиус генерации в градусах.
 * ~0.06° широты ≈ 6.6 км
 * ~0.10° долготы в этих широтах ≈ 6 км
 */
const SPREAD = {
    lat: 0.06,
    lng: 0.10,
};

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

/**
 * Простой детерминированный "seed" из строки.
 */
function hashSeed(s: string): number {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

/**
 * Детерминированный генератор случайных чисел (mulberry32)
 */
function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Сэмплируем точку "плотнее к центру" (примерно нормально-подобно),
 * чтобы маркеры выглядели как город, а не квадрат.
 */
function sampleNearCenter(rand: () => number, center: number, spread: number) {
    // Box-Muller: приблизительно нормальное распределение
    const u1 = Math.max(rand(), 1e-9);
    const u2 = Math.max(rand(), 1e-9);
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2); // ~N(0,1)

    // Делаем "пояс" в рамках spread
    const v = center + z0 * (spread / 3.0); // 3σ ~ spread
    return clamp(v, center - spread, center + spread);
}

function pickStatus(rand: () => number): MapPointStatus {
    // Распределение статусов
    const r = rand();
    if (r < 0.75) return "OK";
    if (r < 0.90) return "WARN";
    if (r < 0.97) return "OFF";
    return "FAULT";
}

function computeLoad(rand: () => number, status: MapPointStatus) {
    // Базовая нагрузка 0.2..6.0 kW
    const base = 0.2 + rand() * 5.8;

    // Корректировки по статусу
    const multiplier =
        status === "OK" ? 0.8 + rand() * 0.6 :
            status === "WARN" ? 0.6 + rand() * 0.6 :
                status === "OFF" ? 0.0 :
                    0.2 + rand() * 0.5; // FAULT

    const loadKw = +(base * multiplier).toFixed(2);

    // loadPct: 0..100, в зависимости от loadKw
    const loadPct = clamp(Math.round((loadKw / 6.0) * 100), 0, 100);

    return { loadKw, loadPct };
}

function buildPoints(params: MapLoadParams, count: number): MapPoint[] {
    const seed = hashSeed(`${params.from}|${params.to}|barnaul`);
    const rand = mulberry32(seed);

    const points: MapPoint[] = [];
    for (let i = 0; i < count; i++) {
        const status = pickStatus(rand);
        const lat = sampleNearCenter(rand, BARNAUL_CENTER.lat, SPREAD.lat);
        const lng = sampleNearCenter(rand, BARNAUL_CENTER.lng, SPREAD.lng);

        const { loadKw, loadPct } = computeLoad(rand, status);

        // updatedAt: случайная точка в диапазоне [from..to]
        const fromMs = new Date(params.from).getTime();
        const toMs = new Date(params.to).getTime();
        const t = fromMs + Math.round(rand() * Math.max(0, toMs - fromMs));
        const updatedAt = new Date(t).toISOString();

        points.push({
            id: i + 1,
            name: `Опора №${i + 1}`,
            lat,
            lng,
            status,
            loadKw,
            loadPct,
            updatedAt,
        });
    }

    return points;
}

export const mapApi = {
    async load(params: MapLoadParams): Promise<MapDataResponse> {
        // Можно менять количество точек под демо
        const points = buildPoints(params, 120);

        const faults = points.filter((p) => p.status === "FAULT").length;
        const totalKw = +points.reduce((acc, p) => acc + p.loadKw, 0).toFixed(2);

        return {
            summary: {
                points: points.length,
                faults,
                totalKw,
                from: params.from,
                to: params.to,
            },
            points,
        };
    },
};

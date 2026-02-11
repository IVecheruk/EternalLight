import type { MapDataResponse, MapPoint, MapHeatCell } from "../model/types";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function rnd(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
function pick<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// центр “города” (Рига) — позже можно менять
const CITY_CENTER = { lat: 53.3481, lng: 83.7636 };

function genPoints(count: number): MapPoint[] {
    const statuses: MapPoint["status"][] = ["OK", "OK", "OK", "WARN", "OFF", "FAULT"];

    return Array.from({ length: count }).map((_, i) => {
        const lat = CITY_CENTER.lat + rnd(-0.06, 0.06);
        const lng = CITY_CENTER.lng + rnd(-0.10, 0.10);

        const loadKw = rnd(0.05, 2.5);
        const loadPct = Math.min(100, Math.max(0, Math.round(loadKw * 35)));
        const status = pick(statuses);

        return {
            id: `pt-${i + 1}`,
            name: `Pole #${i + 1}`,
            lat,
            lng,
            loadKw: Number(loadKw.toFixed(2)),
            loadPct,
            status,
            updatedAt: new Date(Date.now() - rnd(0, 30) * 60_000).toISOString(),
        };
    });
}

function genHeat(points: MapPoint[]): MapHeatCell[] {
    const max = Math.max(...points.map((p) => p.loadKw), 1);
    return points.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        intensity: Math.min(1, p.loadKw / max),
    }));
}

export const mapMockRepo = {
    async load(params?: { from?: string; to?: string }): Promise<MapDataResponse> {
        await delay();

        const from = params?.from ?? new Date(Date.now() - 60 * 60_000).toISOString();
        const to = params?.to ?? new Date().toISOString();

        const points = genPoints(180);
        const heat = genHeat(points);

        const totalKw = points.reduce((s, p) => s + p.loadKw, 0);
        const faults = points.filter((p) => p.status === "FAULT").length;

        return {
            summary: {
                from,
                to,
                totalKw: Number(totalKw.toFixed(1)),
                points: points.length,
                faults,
            },
            points,
            heat,
        };
    },
};

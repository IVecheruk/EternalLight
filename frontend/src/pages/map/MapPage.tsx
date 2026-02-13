import { useEffect, useMemo, useState } from "react";
import MapGL, { Popup, Source, Layer } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MapGeoJSONFeature, LayerProps } from "react-map-gl/maplibre";
import type {
    Feature,
    FeatureCollection,
    Polygon,
    MultiLineString,
    Point as GeoPoint,
} from "geojson";

import { mapApi } from "@/entities/map/api/mapApi";
import type { MapDataResponse, MapPoint } from "@/entities/map/model/types";
import { useTheme } from "@/app/theme/ThemeProvider";

type RangePreset = "1h" | "24h" | "7d";
type ViewMode = "grid" | "heatmap" | "points" | "all";
type GridMetric = "sum" | "avg" | "kde";
type KpiFilterKey = "all" | "ok" | "fault" | "off" | "warn" | "sla" | "complaints";

const kpiFilterLabels: Record<KpiFilterKey, string> = {
    all: "Все",
    ok: "Исправно",
    fault: "Аварии",
    off: "Офлайн",
    warn: "В ремонте",
    sla: "SLA",
    complaints: "Жалобы",
};

const statusLabels: Record<MapPoint["status"], string> = {
    OK: "Исправно",
    WARN: "В ремонте",
    OFF: "Офлайн",
    FAULT: "Авария",
};

const statusBadgeClasses: Record<MapPoint["status"], string> = {
    OK: "border-green-200 bg-green-50 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300",
    WARN: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
    OFF: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-200",
    FAULT: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300",
};

function rangeToDates(preset: RangePreset) {
    const to = new Date();
    const from = new Date(to);

    if (preset === "1h") from.setHours(from.getHours() - 1);
    if (preset === "24h") from.setHours(from.getHours() - 24);
    if (preset === "7d") from.setDate(from.getDate() - 7);

    return { from: from.toISOString(), to: to.toISOString() };
}

// ---- meters <-> degrees (около Барнаула работает нормально) ----
function metersToDegreesLat(m: number) {
    return m / 111_320;
}
function metersToDegreesLng(m: number, latDeg: number) {
    const latRad = (latDeg * Math.PI) / 180;
    return m / (111_320 * Math.cos(latRad));
}

// Быстрая метрика расстояния в метрах (equirectangular)
function distMeters(lng1: number, lat1: number, lng2: number, lat2: number, refLatDeg: number) {
    const kx = 111_320 * Math.cos((refLatDeg * Math.PI) / 180);
    const ky = 111_320;
    const dx = (lng2 - lng1) * kx;
    const dy = (lat2 - lat1) * ky;
    return Math.sqrt(dx * dx + dy * dy);
}

function clamp01(x: number) {
    return Math.max(0, Math.min(1, x));
}

type GridCell = {
    key: string;
    r: number;
    c: number;
    sumKw: number;
    count: number;
    avgKw: number;
    kdeKw: number; // сглаженное значение
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
    centerLng: number;
    centerLat: number;
};

type GridFeatureProps = {
    key: string;
    sumKw: number;
    avgKw: number;
    kdeKw: number;
    count: number;
    centerLng: number;
    centerLat: number;
    intensitySum: number;
    intensityAvg: number;
    intensityKde: number;
};

type PointFeatureProps = {
    id: number | string;
    name: string;
    status: MapPoint["status"];
    loadKw: number;
    loadPct: number;
    updatedAt: string;
    weight: number;
};

function isGridFeature(f: MapGeoJSONFeature): f is MapGeoJSONFeature & { properties: GridFeatureProps } {
    const p = f.properties as Partial<GridFeatureProps> | null | undefined;
    return !!p && typeof p.key === "string" && typeof p.count === "number" && typeof p.sumKw === "number";
}

function isPointFeature(f: MapGeoJSONFeature): f is MapGeoJSONFeature & { properties: PointFeatureProps } {
    const p = f.properties as Partial<PointFeatureProps> | null | undefined;
    return !!p && typeof p.name === "string" && typeof p.loadKw === "number";
}

/**
 * Marching Squares: строим изолинии по нормализованному полю (0..1).
 * Возвращаем MultiLineString фичи (по одному уровню).
 */
function buildContours(
    nodeField: number[][], // (rows+1) x (cols+1)
    minLng: number,
    minLat: number,
    dLng: number,
    dLat: number,
    levels: number[]
): FeatureCollection<MultiLineString, { level: number }> {
    const rows = nodeField.length - 1;
    const cols = nodeField[0].length - 1;

    // Линейная интерполяция на ребре
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const interp = (v1: number, v2: number, level: number) => {
        const denom = v2 - v1;
        if (Math.abs(denom) < 1e-9) return 0.5;
        return clamp01((level - v1) / denom);
    };

    // Вершины клетки (узлы):
    // a----b
    // |    |
    // d----c
    // a=(r,c), b=(r,c+1), c=(r+1,c+1), d=(r+1,c)
    const features: Feature<MultiLineString, { level: number }>[] = [];

    for (const level of levels) {
        const segments: number[][][] = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const a = nodeField[r][c];
                const b = nodeField[r][c + 1];
                const cV = nodeField[r + 1][c + 1];
                const d = nodeField[r + 1][c];

                // индекс кейса (4 бита)
                let idx = 0;
                if (a >= level) idx |= 1;
                if (b >= level) idx |= 2;
                if (cV >= level) idx |= 4;
                if (d >= level) idx |= 8;

                // пусто/полностью заполнено — нет линии
                if (idx === 0 || idx === 15) continue;

                // координаты углов клетки
                const x0 = minLng + c * dLng;
                const x1 = x0 + dLng;
                const y0 = minLat + r * dLat;
                const y1 = y0 + dLat;

                // находим пересечения с рёбрами (top, right, bottom, left)
                const pts: { x: number; y: number }[] = [];

                // top: a-b
                if ((idx & 1) !== (idx & 2)) {
                    const t = interp(a, b, level);
                    pts.push({ x: lerp(x0, x1, t), y: y0 });
                }
                // right: b-c
                if ((idx & 2) !== (idx & 4)) {
                    const t = interp(b, cV, level);
                    pts.push({ x: x1, y: lerp(y0, y1, t) });
                }
                // bottom: d-c
                if ((idx & 8) !== (idx & 4)) {
                    const t = interp(d, cV, level);
                    pts.push({ x: lerp(x0, x1, t), y: y1 });
                }
                // left: a-d
                if ((idx & 1) !== (idx & 8)) {
                    const t = interp(a, d, level);
                    pts.push({ x: x0, y: lerp(y0, y1, t) });
                }

                // Обычно 2 точки → 1 сегмент, иногда 4 → 2 сегмента (амбигуити).
                if (pts.length === 2) {
                    segments.push([
                        [pts[0].x, pts[0].y],
                        [pts[1].x, pts[1].y],
                    ]);
                } else if (pts.length === 4) {
                    // Разбиваем на 2 сегмента
                    segments.push([
                        [pts[0].x, pts[0].y],
                        [pts[1].x, pts[1].y],
                    ]);
                    segments.push([
                        [pts[2].x, pts[2].y],
                        [pts[3].x, pts[3].y],
                    ]);
                }
            }
        }

        if (segments.length) {
            features.push({
                type: "Feature",
                geometry: { type: "MultiLineString", coordinates: segments },
                properties: { level },
            });
        }
    }

    return { type: "FeatureCollection", features };
}

export function MapPage() {
    const { theme } = useTheme();

    const [preset, setPreset] = useState<RangePreset>("1h");
    const [mode, setMode] = useState<ViewMode>("all");
    const [metric, setMetric] = useState<GridMetric>("kde");

    const [cellSizeM, setCellSizeM] = useState<number>(350);
    const [blurRadiusM, setBlurRadiusM] = useState<number>(650);
    const [showContours, setShowContours] = useState<boolean>(true);

    const [data, setData] = useState<MapDataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [kpiFilter, setKpiFilter] = useState<KpiFilterKey>("all");

    const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
    const [activeCell, setActiveCell] = useState<{
        key: string;
        sumKw: number;
        avgKw: number;
        kdeKw: number;
        count: number;
        centerLng: number;
        centerLat: number;
    } | null>(null);

    const { from, to } = useMemo(() => rangeToDates(preset), [preset]);
    const allPoints = data?.points ?? [];

    const pointStats = useMemo(() => {
        let ok = 0;
        let warn = 0;
        let off = 0;
        let fault = 0;

        for (const p of allPoints) {
            if (p.status === "OK") ok += 1;
            if (p.status === "WARN") warn += 1;
            if (p.status === "OFF") off += 1;
            if (p.status === "FAULT") fault += 1;
        }

        return { total: allPoints.length, ok, warn, off, fault };
    }, [allPoints]);

    const slaPct = pointStats.total ? Math.round((pointStats.ok / pointStats.total) * 100) : 0;

    const kpiCards = useMemo(
        () => [
            {
                key: "ok" as const,
                title: "Исправно",
                value: pointStats.ok,
                caption: pointStats.total ? `из ${pointStats.total}` : "нет данных",
                accent: "bg-green-500",
            },
            {
                key: "fault" as const,
                title: "Аварии",
                value: pointStats.fault,
                caption: "критические",
                accent: "bg-red-500",
            },
            {
                key: "off" as const,
                title: "Офлайн",
                value: pointStats.off,
                caption: "нет связи",
                accent: "bg-slate-500",
            },
            {
                key: "warn" as const,
                title: "В ремонте",
                value: pointStats.warn,
                caption: "в работе",
                accent: "bg-amber-500",
            },
            {
                key: "sla" as const,
                title: "SLA",
                value: `${slaPct}%`,
                caption: pointStats.total ? `${pointStats.ok}/${pointStats.total}` : "нет данных",
                accent: "bg-sky-500",
            },
            {
                key: "complaints" as const,
                title: "Жалобы",
                value: pointStats.fault,
                caption: "обращения",
                accent: "bg-rose-500",
            },
        ],
        [pointStats, slaPct]
    );

    const filteredPoints = useMemo(() => {
        if (kpiFilter === "all") return allPoints;
        const matches =
            kpiFilter === "ok"
                ? (p: MapPoint) => p.status === "OK"
                : kpiFilter === "fault"
                  ? (p: MapPoint) => p.status === "FAULT"
                  : kpiFilter === "off"
                    ? (p: MapPoint) => p.status === "OFF"
                    : kpiFilter === "warn"
                      ? (p: MapPoint) => p.status === "WARN"
                      : kpiFilter === "sla"
                        ? (p: MapPoint) => p.status === "OK"
                        : (p: MapPoint) => p.status === "FAULT";
        return allPoints.filter(matches);
    }, [allPoints, kpiFilter]);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await mapApi.load({ from, to });
            setData(res);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось загрузить данные карты");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preset]);

    // Барнаул
    const initialViewState = useMemo(
        () => ({
            longitude: 83.7636,
            latitude: 53.3481,
            zoom: 11.5,
        }),
        []
    );

    const mapStyle = useMemo(
        () =>
            theme === "dark"
                ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        [theme]
    );

    // ---- points geojson ----
    const pointsGeoJson: FeatureCollection<GeoPoint, PointFeatureProps> = useMemo(() => {
        const points = filteredPoints;
        return {
            type: "FeatureCollection",
            features: points.map(
                (p): Feature<GeoPoint, PointFeatureProps> => ({
                    type: "Feature",
                    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
                    properties: {
                        id: p.id,
                        name: p.name,
                        status: p.status,
                        loadKw: p.loadKw,
                        loadPct: p.loadPct,
                        updatedAt: p.updatedAt,
                        weight: p.loadKw,
                    },
                })
            ),
        };
    }, [filteredPoints]);

    const maxPointKw = useMemo(() => {
        const arr = filteredPoints.map((p) => p.loadKw);
        const m = arr.length ? Math.max(...arr) : 1;
        return m > 0 ? m : 1;
    }, [filteredPoints]);

    // ---- GRID + KDE (blur) + contours ----
    const gridComputed = useMemo(() => {
        const points = filteredPoints;

        const emptyGrid: FeatureCollection<Polygon, GridFeatureProps> = { type: "FeatureCollection", features: [] };
        const emptyContours: FeatureCollection<MultiLineString, { level: number }> = {
            type: "FeatureCollection",
            features: [],
        };

        if (!points.length) {
            return {
                gridGeo: emptyGrid,
                contoursGeo: emptyContours,
                maxSum: 1,
                maxAvg: 1,
                maxKde: 1,
                minLng: 0,
                minLat: 0,
                dLng: 0,
                dLat: 0,
            };
        }

        // refLat для расстояний/градусов
        const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
        const dLat = metersToDegreesLat(cellSizeM);
        const dLng = metersToDegreesLng(cellSizeM, avgLat);

        // bbox
        let minLat = Infinity,
            maxLat = -Infinity,
            minLng = Infinity,
            maxLng = -Infinity;

        for (const p of points) {
            minLat = Math.min(minLat, p.lat);
            maxLat = Math.max(maxLat, p.lat);
            minLng = Math.min(minLng, p.lng);
            maxLng = Math.max(maxLng, p.lng);
        }

        // расширим bbox под blur (чтобы не обрезать пятно)
        const padLat = metersToDegreesLat(blurRadiusM * 1.2);
        const padLng = metersToDegreesLng(blurRadiusM * 1.2, avgLat);

        minLat -= padLat;
        maxLat += padLat;
        minLng -= padLng;
        maxLng += padLng;

        // размеры сетки (ограничим чтобы не улететь по производительности)
        let cols = Math.max(1, Math.ceil((maxLng - minLng) / dLng));
        let rows = Math.max(1, Math.ceil((maxLat - minLat) / dLat));

        const maxCells = 70 * 70; // безопасно для фронта
        if (rows * cols > maxCells) {
            const scale = Math.sqrt((rows * cols) / maxCells);
            const newCell = Math.round(cellSizeM * scale);
            const dLat2 = metersToDegreesLat(newCell);
            const dLng2 = metersToDegreesLng(newCell, avgLat);
            cols = Math.max(1, Math.ceil((maxLng - minLng) / dLng2));
            rows = Math.max(1, Math.ceil((maxLat - minLat) / dLat2));
            // подменим
            return (() => {
                // рекурсивно пересчитать с увеличенной клеткой без рекурсии
                // (повторим один раз)
                const dLatR = dLat2;
                const dLngR = dLng2;

                const cells: GridCell[] = [];
                const sigma = Math.max(1, blurRadiusM);
                const twoSigma2 = 2 * sigma * sigma;

                let maxSum = 1;
                let maxAvg = 1;
                let maxKde = 1;

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const cellMinLng = minLng + c * dLngR;
                        const cellMinLat = minLat + r * dLatR;
                        const cellMaxLng = cellMinLng + dLngR;
                        const cellMaxLat = cellMinLat + dLatR;
                        const centerLng = (cellMinLng + cellMaxLng) / 2;
                        const centerLat = (cellMinLat + cellMaxLat) / 2;

                        let sumKw = 0;
                        let count = 0;

                        // raw sum/count: просто точки попавшие внутрь клетки
                        for (const p of points) {
                            if (p.lng >= cellMinLng && p.lng < cellMaxLng && p.lat >= cellMinLat && p.lat < cellMaxLat) {
                                sumKw += p.loadKw;
                                count += 1;
                            }
                        }

                        const avgKw = sumKw / Math.max(1, count);

                        // KDE: вклад всех точек с gaussian kernel
                        let kdeKw = 0;
                        for (const p of points) {
                            const d = distMeters(centerLng, centerLat, p.lng, p.lat, avgLat);
                            const w = Math.exp(-(d * d) / twoSigma2);
                            kdeKw += p.loadKw * w;
                        }

                        maxSum = Math.max(maxSum, sumKw);
                        maxAvg = Math.max(maxAvg, avgKw);
                        maxKde = Math.max(maxKde, kdeKw);

                        cells.push({
                            key: `${r}:${c}`,
                            r,
                            c,
                            sumKw,
                            count,
                            avgKw,
                            kdeKw,
                            minLng: cellMinLng,
                            minLat: cellMinLat,
                            maxLng: cellMaxLng,
                            maxLat: cellMaxLat,
                            centerLng,
                            centerLat,
                        });
                    }
                }

                // поле на узлах для контуров: (rows+1)x(cols+1)
                // возьмём intensityKde на соседних клетках и усредним
                const nodeField: number[][] = Array.from({ length: rows + 1 }, () =>
                    Array.from({ length: cols + 1 }, () => 0)
                );

                // заполняем узлы как среднее из 4 соседних клеток
                for (let nr = 0; nr <= rows; nr++) {
                    for (let nc = 0; nc <= cols; nc++) {
                        let s = 0;
                        let k = 0;

                        // клетки вокруг узла: (nr-1,nc-1), (nr-1,nc), (nr,nc-1), (nr,nc)
                        const idxs = [
                            { r: nr - 1, c: nc - 1 },
                            { r: nr - 1, c: nc },
                            { r: nr, c: nc - 1 },
                            { r: nr, c: nc },
                        ];

                        for (const it of idxs) {
                            if (it.r >= 0 && it.c >= 0 && it.r < rows && it.c < cols) {
                                const cell = cells[it.r * cols + it.c];
                                const intensity = maxKde > 0 ? cell.kdeKw / maxKde : 0;
                                s += intensity;
                                k += 1;
                            }
                        }

                        nodeField[nr][nc] = k ? s / k : 0;
                    }
                }

                const contoursGeo: FeatureCollection<MultiLineString, { level: number }> = showContours
                    ? buildContours(
                        nodeField,
                        minLng,
                        minLat,
                        dLngR,
                        dLatR,
                        [0.2, 0.35, 0.5, 0.65, 0.8]
                    )
                    : { type: "FeatureCollection", features: [] };

                const gridGeo: FeatureCollection<Polygon, GridFeatureProps> = {
                    type: "FeatureCollection",
                    features: cells.map(
                        (c): Feature<Polygon, GridFeatureProps> => ({
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [
                                    [
                                        [c.minLng, c.minLat],
                                        [c.maxLng, c.minLat],
                                        [c.maxLng, c.maxLat],
                                        [c.minLng, c.maxLat],
                                        [c.minLng, c.minLat],
                                    ],
                                ],
                            },
                            properties: {
                                key: c.key,
                                sumKw: c.sumKw,
                                avgKw: c.avgKw,
                                kdeKw: c.kdeKw,
                                count: c.count,
                                centerLng: c.centerLng,
                                centerLat: c.centerLat,
                                intensitySum: maxSum > 0 ? c.sumKw / maxSum : 0,
                                intensityAvg: maxAvg > 0 ? c.avgKw / maxAvg : 0,
                                intensityKde: maxKde > 0 ? c.kdeKw / maxKde : 0,
                            },
                        })
                    ),
                };

                return { gridGeo, contoursGeo, maxSum, maxAvg, maxKde, minLng, minLat, dLng: dLngR, dLat: dLatR };
            })();
        }

        // обычный расчёт (без масштаба)
        const cells: GridCell[] = [];
        const sigma = Math.max(1, blurRadiusM);
        const twoSigma2 = 2 * sigma * sigma;

        let maxSum = 1;
        let maxAvg = 1;
        let maxKde = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cellMinLng = minLng + c * dLng;
                const cellMinLat = minLat + r * dLat;
                const cellMaxLng = cellMinLng + dLng;
                const cellMaxLat = cellMinLat + dLat;
                const centerLng = (cellMinLng + cellMaxLng) / 2;
                const centerLat = (cellMinLat + cellMaxLat) / 2;

                let sumKw = 0;
                let count = 0;

                for (const p of points) {
                    if (p.lng >= cellMinLng && p.lng < cellMaxLng && p.lat >= cellMinLat && p.lat < cellMaxLat) {
                        sumKw += p.loadKw;
                        count += 1;
                    }
                }

                const avgKw = sumKw / Math.max(1, count);

                let kdeKw = 0;
                for (const p of points) {
                    const d = distMeters(centerLng, centerLat, p.lng, p.lat, avgLat);
                    const w = Math.exp(-(d * d) / twoSigma2);
                    kdeKw += p.loadKw * w;
                }

                maxSum = Math.max(maxSum, sumKw);
                maxAvg = Math.max(maxAvg, avgKw);
                maxKde = Math.max(maxKde, kdeKw);

                cells.push({
                    key: `${r}:${c}`,
                    r,
                    c,
                    sumKw,
                    count,
                    avgKw,
                    kdeKw,
                    minLng: cellMinLng,
                    minLat: cellMinLat,
                    maxLng: cellMaxLng,
                    maxLat: cellMaxLat,
                    centerLng,
                    centerLat,
                });
            }
        }

        // узлы для контуров (rows+1)x(cols+1)
        const nodeField: number[][] = Array.from({ length: rows + 1 }, () => Array.from({ length: cols + 1 }, () => 0));

        for (let nr = 0; nr <= rows; nr++) {
            for (let nc = 0; nc <= cols; nc++) {
                let s = 0;
                let k = 0;

                const idxs = [
                    { r: nr - 1, c: nc - 1 },
                    { r: nr - 1, c: nc },
                    { r: nr, c: nc - 1 },
                    { r: nr, c: nc },
                ];

                for (const it of idxs) {
                    if (it.r >= 0 && it.c >= 0 && it.r < rows && it.c < cols) {
                        const cell = cells[it.r * cols + it.c];
                        const intensity = maxKde > 0 ? cell.kdeKw / maxKde : 0;
                        s += intensity;
                        k += 1;
                    }
                }

                nodeField[nr][nc] = k ? s / k : 0;
            }
        }

        const contoursGeo = showContours
            ? buildContours(nodeField, minLng, minLat, dLng, dLat, [0.2, 0.35, 0.5, 0.65, 0.8])
            : emptyContours;

        const gridGeo: FeatureCollection<Polygon, GridFeatureProps> = {
            type: "FeatureCollection",
            features: cells.map(
                (c): Feature<Polygon, GridFeatureProps> => ({
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [c.minLng, c.minLat],
                                [c.maxLng, c.minLat],
                                [c.maxLng, c.maxLat],
                                [c.minLng, c.maxLat],
                                [c.minLng, c.minLat],
                            ],
                        ],
                    },
                    properties: {
                        key: c.key,
                        sumKw: c.sumKw,
                        avgKw: c.avgKw,
                        kdeKw: c.kdeKw,
                        count: c.count,
                        centerLng: c.centerLng,
                        centerLat: c.centerLat,
                        intensitySum: maxSum > 0 ? c.sumKw / maxSum : 0,
                        intensityAvg: maxAvg > 0 ? c.avgKw / maxAvg : 0,
                        intensityKde: maxKde > 0 ? c.kdeKw / maxKde : 0,
                    },
                })
            ),
        };

        return { gridGeo, contoursGeo, maxSum, maxAvg, maxKde, minLng, minLat, dLng, dLat };
    }, [filteredPoints, cellSizeM, blurRadiusM, showContours]);

    const intensityProp = metric === "sum" ? "intensitySum" : metric === "avg" ? "intensityAvg" : "intensityKde";

    // ---- layers ----
    const heatmapLayer: LayerProps = useMemo(
        () => ({
            id: "heat",
            type: "heatmap",
            source: "points",
            paint: {
                "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, maxPointKw, 1],
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 2.5],
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 18, 14, 44],
                "heatmap-opacity": mode === "points" || mode === "grid" ? 0 : 0.85,
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(0,0,0,0)",
                    0.25,
                    "rgba(34,197,94,0.55)",
                    0.5,
                    "rgba(245,158,11,0.65)",
                    0.75,
                    "rgba(239,68,68,0.75)",
                    1,
                    "rgba(220,38,38,0.9)",
                ],
            },
        }),
        [maxPointKw, mode]
    );

    const circlesLayer: LayerProps = useMemo(
        () => ({
            id: "circles",
            type: "circle",
            source: "points",
            paint: {
                "circle-radius": ["interpolate", ["linear"], ["get", "loadPct"], 0, 4, 100, 10],
                "circle-color": [
                    "match",
                    ["get", "status"],
                    "OK",
                    "#22c55e",
                    "WARN",
                    "#f59e0b",
                    "OFF",
                    "#64748b",
                    "FAULT",
                    "#ef4444",
                    "#0f172a",
                ],
                "circle-opacity": mode === "heatmap" || mode === "grid" ? 0 : 0.85,
                "circle-stroke-color": "rgba(255,255,255,0.9)",
                "circle-stroke-width": 2,
            },
        }),
        [mode]
    );

    const gridFillLayer: LayerProps = useMemo(
        () => ({
            id: "grid-fill",
            type: "fill",
            source: "grid",
            paint: {
                "fill-opacity": mode === "heatmap" || mode === "points" ? 0 : 0.62,
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["get", intensityProp],
                    0,
                    "rgba(34,197,94,0.10)",
                    0.25,
                    "rgba(34,197,94,0.30)",
                    0.5,
                    "rgba(245,158,11,0.45)",
                    0.75,
                    "rgba(239,68,68,0.55)",
                    1,
                    "rgba(220,38,38,0.70)",
                ],
            },
        }),
        [mode, intensityProp]
    );

    const gridLineLayer: LayerProps = useMemo(
        () => ({
            id: "grid-line",
            type: "line",
            source: "grid",
            paint: {
                "line-opacity": mode === "heatmap" || mode === "points" ? 0 : 0.25,
                "line-color": theme === "dark" ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)",
                "line-width": 1,
            },
        }),
        [mode, theme]
    );

    const contourLayer: LayerProps = useMemo(
        () => ({
            id: "contours",
            type: "line",
            source: "contours",
            paint: {
                "line-color": theme === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                "line-width": 1.6,
                "line-opacity":
                    showContours && (mode === "grid" || mode === "all") && metric === "kde" ? 0.85 : 0,
            },
        }),
        [theme, showContours, mode, metric]
    );

    const interactiveLayerIds = useMemo(() => {
        const ids: string[] = [];
        if (mode === "grid" || mode === "all") ids.push("grid-fill");
        if (mode === "points" || mode === "all") ids.push("circles");
        return ids;
    }, [mode]);

    const onMapClick = (e: MapLayerMouseEvent) => {
        const features = (e.features ?? []) as MapGeoJSONFeature[];

        const gridF = features.find((f) => f.layer?.id === "grid-fill");
        if (gridF && isGridFeature(gridF)) {
            setActivePoint(null);
            setActiveCell({
                key: gridF.properties.key,
                sumKw: Number(gridF.properties.sumKw),
                avgKw: Number(gridF.properties.avgKw),
                kdeKw: Number(gridF.properties.kdeKw),
                count: Number(gridF.properties.count),
                centerLng: Number(gridF.properties.centerLng),
                centerLat: Number(gridF.properties.centerLat),
            });
            return;
        }

        const pointF = features.find((f) => f.layer?.id === "circles");
        if (pointF && isPointFeature(pointF)) {
            setActiveCell(null);
            setActivePoint({
                id: String(pointF.properties.id),
                name: String(pointF.properties.name),
                status: pointF.properties.status,
                loadKw: Number(pointF.properties.loadKw),
                loadPct: Number(pointF.properties.loadPct),
                updatedAt: String(pointF.properties.updatedAt),
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
            });
            return;
        }

        setActiveCell(null);
        setActivePoint(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Сводка и карта</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Сводные показатели по освещению и фильтрация карты по статусам.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={preset}
                        onChange={(e) => setPreset(e.target.value as RangePreset)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="1h">Последний час</option>
                        <option value="24h">Последние 24 часа</option>
                        <option value="7d">Последние 7 дней</option>
                    </select>

                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ViewMode)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="all">Сетка + теплокарта + точки</option>
                        <option value="grid">Только сетка</option>
                        <option value="heatmap">Только теплокарта</option>
                        <option value="points">Только точки</option>
                    </select>

                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value as GridMetric)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                        title="Метрика окраски сетки"
                    >
                        <option value="kde">Метрика сетки: KDE (размытие)</option>
                        <option value="sum">Метрика сетки: сумма кВт</option>
                        <option value="avg">Метрика сетки: средняя кВт</option>
                    </select>

                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Ячейка</span>
                        <select
                            value={cellSizeM}
                            onChange={(e) => setCellSizeM(Number(e.target.value))}
                            className="bg-transparent text-sm outline-none"
                            title="Размер ячейки"
                        >
                            <option value={200}>200m</option>
                            <option value={350}>350m</option>
                            <option value={500}>500m</option>
                            <option value={800}>800m</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Размытие</span>
                        <select
                            value={blurRadiusM}
                            onChange={(e) => setBlurRadiusM(Number(e.target.value))}
                            className="bg-transparent text-sm outline-none"
                            title="Радиус размытия (KDE)"
                        >
                            <option value={350}>350m</option>
                            <option value={650}>650m</option>
                            <option value={900}>900m</option>
                            <option value={1200}>1200m</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                        <input
                            type="checkbox"
                            checked={showContours}
                            onChange={(e) => setShowContours(e.target.checked)}
                        />
                        Изолинии
                    </label>

                    <button
                        type="button"
                        onClick={() => void load()}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        disabled={loading}
                    >
                        {loading ? "Загрузка..." : "Обновить"}
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {kpiCards.map((card) => {
                    const isActive = kpiFilter === card.key;
                    return (
                        <button
                            key={card.key}
                            type="button"
                            onClick={() => setKpiFilter((prev) => (prev === card.key ? "all" : card.key))}
                            className={[
                                "group flex h-full w-full flex-col justify-between rounded-2xl border p-4 text-left transition",
                                "bg-white shadow-sm dark:bg-neutral-950",
                                isActive
                                    ? "border-neutral-900 ring-2 ring-neutral-900/10 dark:border-neutral-100 dark:ring-neutral-100/10"
                                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700",
                            ].join(" ")}
                            aria-pressed={isActive}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                        {card.title}
                                    </div>
                                    <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                                        {card.value}
                                    </div>
                                </div>
                                <div className={`h-9 w-9 rounded-full ${card.accent} opacity-80`} />
                            </div>
                            <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                {card.caption}
                            </div>
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
            )}

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Барнаул • KDE-размытие + изолинии</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-300">
                            Клик по клетке или точке открывает детали. Контуры строятся по KDE (метрика=kde).
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="rounded-full border border-neutral-200 px-3 py-2 dark:border-neutral-800">
                                Фильтр: {kpiFilterLabels[kpiFilter]}
                            </span>
                            <span>
                                Показано: {filteredPoints.length} из {pointStats.total}
                            </span>
                            {kpiFilter !== "all" ? (
                                <button
                                    type="button"
                                    onClick={() => setKpiFilter("all")}
                                    className="rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
                                >
                                    Сбросить
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                        <span>Интенсивность</span>
                        <div className="h-2 w-36 rounded-full bg-gradient-to-r from-green-500 via-amber-400 to-red-600 opacity-80" />
                        <span>низкая</span>
                        <span>высокая</span>
                    </div>
                </div>

                <div className="h-[520px]">
                    <MapGL
                        initialViewState={initialViewState}
                        mapStyle={mapStyle}
                        style={{ width: "100%", height: "100%" }}
                        interactiveLayerIds={interactiveLayerIds}
                        onClick={onMapClick}
                    >
                        {/* GRID */}
                        <Source id="grid" type="geojson" data={gridComputed.gridGeo}>
                            <Layer {...gridFillLayer} />
                            <Layer {...gridLineLayer} />
                        </Source>

                        {/* CONTOURS */}
                        <Source id="contours" type="geojson" data={gridComputed.contoursGeo}>
                            <Layer {...contourLayer} />
                        </Source>

                        {/* POINTS */}
                        <Source id="points" type="geojson" data={pointsGeoJson}>
                            <Layer {...heatmapLayer} />
                            <Layer {...circlesLayer} />
                        </Source>

                        {/* POPUPS */}
                        {activeCell && (
                            <Popup
                                longitude={activeCell.centerLng}
                                latitude={activeCell.centerLat}
                                anchor="top"
                                closeOnClick={false}
                                onClose={() => setActiveCell(null)}
                            >
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold">Ячейка {activeCell.key}</div>
                                    <div className="text-xs text-neutral-700">
                                        <div>
                                            <b>Точки:</b> {activeCell.count}
                                        </div>
                                        <div>
                                            <b>Сумма:</b> {activeCell.sumKw.toFixed(2)} кВт
                                        </div>
                                        <div>
                                            <b>Среднее:</b> {activeCell.avgKw.toFixed(2)} кВт / точку
                                        </div>
                                        <div>
                                            <b>KDE:</b> {activeCell.kdeKw.toFixed(2)} (размытие)
                                        </div>
                                        <div className="pt-1 text-[11px] text-neutral-500">
                                            Текущая метрика: {metric.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        )}

                        {activePoint && (
                            <Popup
                                longitude={activePoint.lng}
                                latitude={activePoint.lat}
                                anchor="top"
                                closeOnClick={false}
                                onClose={() => setActivePoint(null)}
                            >
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold">{activePoint.name}</div>
                                    <div className="text-xs text-neutral-700">
                                        <div>
                                            <b>ID:</b> {activePoint.id}
                                        </div>
                                        <div>
                                            <b>Статус:</b> {statusLabels[activePoint.status]}
                                        </div>
                                        <div>
                                            <b>Нагрузка:</b> {activePoint.loadKw} кВт ({activePoint.loadPct}%)
                                        </div>
                                        <div>
                                            <b>Обновлено:</b> {new Date(activePoint.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        )}
                    </MapGL>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <div className="space-y-1">
                        <div className="text-sm font-medium">Список точек</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-300">
                            Фильтр: {kpiFilterLabels[kpiFilter]} • Показано {filteredPoints.length} из{" "}
                            {pointStats.total}
                        </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Диапазон: {new Date(from).toLocaleString()} — {new Date(to).toLocaleString()}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900/40 dark:text-neutral-400">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Объект</th>
                                <th className="px-4 py-3 text-left font-semibold">Статус</th>
                                <th className="px-4 py-3 text-left font-semibold">Нагрузка, кВт</th>
                                <th className="px-4 py-3 text-left font-semibold">Нагрузка, %</th>
                                <th className="px-4 py-3 text-left font-semibold">Обновлено</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filteredPoints.length ? (
                                filteredPoints.map((point) => (
                                    <tr key={point.id} className="text-neutral-700 dark:text-neutral-200">
                                        <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">
                                            {point.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={[
                                                    "inline-flex items-center rounded-full border px-3 py-2 text-xs font-medium",
                                                    statusBadgeClasses[point.status],
                                                ].join(" ")}
                                            >
                                                {statusLabels[point.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{point.loadKw.toFixed(2)}</td>
                                        <td className="px-4 py-2">{point.loadPct.toFixed(0)}%</td>
                                        <td className="px-4 py-2 text-xs text-neutral-500 dark:text-neutral-400">
                                            {new Date(point.updatedAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400"
                                    >
                                        Нет данных по выбранному фильтру.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

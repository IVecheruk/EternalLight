import { useEffect, useMemo, useState } from "react";
import MapGL, { Popup, Source, Layer } from "react-map-gl/maplibre";
import type {
    MapGeoJSONFeature,
    MapLayerMouseEvent,
    LayerProps,
} from "react-map-gl/maplibre";
import type { Feature, FeatureCollection, Point, Polygon } from "geojson";

import { mapApi } from "@/entities/map/api/mapApi";
import type { MapDataResponse, MapPoint } from "@/entities/map/model/types";
import { useTheme } from "@/app/theme/ThemeProvider";

type RangePreset = "1h" | "24h" | "7d";
type ViewMode = "grid" | "heatmap" | "points" | "all";

function rangeToDates(preset: RangePreset) {
    const to = new Date();
    const from = new Date(to);

    if (preset === "1h") from.setHours(from.getHours() - 1);
    if (preset === "24h") from.setHours(from.getHours() - 24);
    if (preset === "7d") from.setDate(from.getDate() - 7);

    return { from: from.toISOString(), to: to.toISOString() };
}

// ---- utils: meters <-> degrees ----
function metersToDegreesLat(m: number) {
    return m / 111_320;
}
function metersToDegreesLng(m: number, latDeg: number) {
    const latRad = (latDeg * Math.PI) / 180;
    return m / (111_320 * Math.cos(latRad));
}

type Cell = {
    key: string;
    r: number;
    c: number;
    sumKw: number;
    count: number;
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
    count: number;
    centerLng: number;
    centerLat: number;
    intensity: number;
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

// helpers: safe number conversion from unknown
function toNumber(v: unknown): number {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
}
function toString(v: unknown): string {
    return typeof v === "string" ? v : String(v ?? "");
}

function isGridFeature(
    f: MapGeoJSONFeature
): f is MapGeoJSONFeature & { properties: GridFeatureProps } {
    const p = f.properties as Record<string, unknown> | null | undefined;
    return !!p && typeof p.key === "string" && "sumKw" in p && "count" in p;
}

function isPointFeature(
    f: MapGeoJSONFeature
): f is MapGeoJSONFeature & { properties: PointFeatureProps } {
    const p = f.properties as Record<string, unknown> | null | undefined;
    return !!p && typeof p.name === "string" && "loadKw" in p && "status" in p;
}

export function MapPage() {
    const { theme } = useTheme();

    const [preset, setPreset] = useState<RangePreset>("1h");
    const [mode, setMode] = useState<ViewMode>("all");
    const [cellSizeM, setCellSizeM] = useState<number>(350);

    const [data, setData] = useState<MapDataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
    const [activeCell, setActiveCell] = useState<{
        key: string;
        sumKw: number;
        count: number;
        centerLng: number;
        centerLat: number;
    } | null>(null);

    const { from, to } = useMemo(() => rangeToDates(preset), [preset]);

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

    // Барнаул (lng, lat)
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
    const pointsGeoJson: FeatureCollection<Point, PointFeatureProps> = useMemo(() => {
        const points = data?.points ?? [];
        return {
            type: "FeatureCollection",
            features: points.map(
                (p): Feature<Point, PointFeatureProps> => ({
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
    }, [data]);

    const maxKw = useMemo(() => {
        const arr = data?.points?.map((p) => p.loadKw) ?? [];
        const m = arr.length ? Math.max(...arr) : 1;
        return m > 0 ? m : 1;
    }, [data]);

    // ---- grid aggregation ----
    const grid = useMemo(() => {
        const points = data?.points ?? [];
        if (points.length === 0) {
            const empty: FeatureCollection<Polygon, GridFeatureProps> = {
                type: "FeatureCollection",
                features: [],
            };
            return {
                cellsGeoJson: empty,
                maxCellKw: 1,
                cellsIndex: new globalThis.Map<string, Cell>(),
            };
        }

        const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
        const dLat = metersToDegreesLat(cellSizeM);
        const dLng = metersToDegreesLng(cellSizeM, avgLat);

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

        // expand bbox a bit
        minLat -= dLat;
        maxLat += dLat;
        minLng -= dLng;
        maxLng += dLng;

        const cols = Math.max(1, Math.ceil((maxLng - minLng) / dLng));
        const rows = Math.max(1, Math.ceil((maxLat - minLat) / dLat));

        const map = new globalThis.Map<string, Cell>();

        for (const p of points) {
            const c = Math.floor((p.lng - minLng) / dLng);
            const r = Math.floor((p.lat - minLat) / dLat);
            if (c < 0 || r < 0 || c >= cols || r >= rows) continue;

            const key = `${r}:${c}`;
            let cell = map.get(key);

            if (!cell) {
                const cellMinLng = minLng + c * dLng;
                const cellMinLat = minLat + r * dLat;
                const cellMaxLng = cellMinLng + dLng;
                const cellMaxLat = cellMinLat + dLat;

                cell = {
                    key,
                    r,
                    c,
                    sumKw: 0,
                    count: 0,
                    minLng: cellMinLng,
                    minLat: cellMinLat,
                    maxLng: cellMaxLng,
                    maxLat: cellMaxLat,
                    centerLng: (cellMinLng + cellMaxLng) / 2,
                    centerLat: (cellMinLat + cellMaxLat) / 2,
                };

                map.set(key, cell);
            }

            cell.sumKw += p.loadKw;
            cell.count += 1;
        }

        let maxCellKw = 1;
        for (const cell of map.values()) {
            maxCellKw = Math.max(maxCellKw, cell.sumKw);
        }

        const cellsGeoJson: FeatureCollection<Polygon, GridFeatureProps> = {
            type: "FeatureCollection",
            features: Array.from(map.values())
                .filter((c) => c.count > 0)
                .map(
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
                            count: c.count,
                            centerLng: c.centerLng,
                            centerLat: c.centerLat,
                            intensity: maxCellKw > 0 ? c.sumKw / maxCellKw : 0,
                        },
                    })
                ),
        };

        return { cellsGeoJson, maxCellKw, cellsIndex: map };
    }, [data, cellSizeM]);

    // ---- layers ----
    const heatmapLayer: LayerProps = useMemo(
        () => ({
            id: "heat",
            type: "heatmap",
            source: "points",
            paint: {
                "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, maxKw, 1],
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 2.5],
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 18, 14, 40],
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
        [maxKw, mode]
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
                "fill-opacity": mode === "heatmap" || mode === "points" ? 0 : 0.65,
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "intensity"],
                    0,
                    "rgba(34,197,94,0.10)",
                    0.3,
                    "rgba(34,197,94,0.35)",
                    0.55,
                    "rgba(245,158,11,0.45)",
                    0.8,
                    "rgba(239,68,68,0.55)",
                    1,
                    "rgba(220,38,38,0.70)",
                ],
            },
        }),
        [mode]
    );

    const gridLineLayer: LayerProps = useMemo(
        () => ({
            id: "grid-line",
            type: "line",
            source: "grid",
            paint: {
                "line-opacity": mode === "heatmap" || mode === "points" ? 0 : 0.35,
                "line-color": theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)",
                "line-width": 1,
            },
        }),
        [mode, theme]
    );

    const interactiveLayerIds = useMemo(() => {
        const ids: string[] = [];
        if (mode === "grid" || mode === "all") ids.push("grid-fill");
        if (mode === "points" || mode === "all") ids.push("circles");
        return ids;
    }, [mode]);

    const onMapClick = (e: MapLayerMouseEvent) => {
        const features = (e.features ?? []) as MapGeoJSONFeature[];

        // priority: grid
        const gridF = features.find((f) => f.layer?.id === "grid-fill");
        if (gridF && isGridFeature(gridF)) {
            setActivePoint(null);
            setActiveCell({
                key: toString(gridF.properties.key),
                sumKw: toNumber(gridF.properties.sumKw),
                count: toNumber(gridF.properties.count),
                centerLng: toNumber(gridF.properties.centerLng),
                centerLat: toNumber(gridF.properties.centerLat),
            });
            return;
        }

        // then points
        const pointF = features.find((f) => f.layer?.id === "circles");
        if (pointF && isPointFeature(pointF)) {
            setActiveCell(null);
            setActivePoint({
                id: toNumber(pointF.properties.id),
                name: toString(pointF.properties.name),
                status: pointF.properties.status,
                loadKw: toNumber(pointF.properties.loadKw),
                loadPct: toNumber(pointF.properties.loadPct),
                updatedAt: toString(pointF.properties.updatedAt),
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
            });
            return;
        }

        setActiveCell(null);
        setActivePoint(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Map</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Агрегация на фронте: сетка → суммарная нагрузка (kW) по клеткам.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={preset}
                        onChange={(e) => setPreset(e.target.value as RangePreset)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="1h">Last 1 hour</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                    </select>

                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ViewMode)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="all">Grid + Heatmap + Points</option>
                        <option value="grid">Grid only</option>
                        <option value="heatmap">Heatmap only</option>
                        <option value="points">Points only</option>
                    </select>

                    <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Cell</span>
                        <select
                            value={cellSizeM}
                            onChange={(e) => setCellSizeM(Number(e.target.value))}
                            className="bg-transparent text-sm outline-none"
                            title="Размер клетки"
                        >
                            <option value={200}>200m</option>
                            <option value={350}>350m</option>
                            <option value={500}>500m</option>
                            <option value={800}>800m</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => void load()}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        disabled={loading}
                    >
                        {loading ? "Loading…" : "Refresh"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <div className="text-sm font-medium">Barnaul grid aggregation</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        Клик по клетке / точке → popup.
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
                        <Source id="grid" type="geojson" data={grid.cellsGeoJson}>
                            <Layer {...gridFillLayer} />
                            <Layer {...gridLineLayer} />
                        </Source>

                        {/* POINTS */}
                        <Source id="points" type="geojson" data={pointsGeoJson}>
                            <Layer {...heatmapLayer} />
                            <Layer {...circlesLayer} />
                        </Source>

                        {/* Grid popup */}
                        {activeCell && (
                            <Popup
                                longitude={activeCell.centerLng}
                                latitude={activeCell.centerLat}
                                anchor="top"
                                closeOnClick={false}
                                onClose={() => setActiveCell(null)}
                            >
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold">Cell {activeCell.key}</div>
                                    <div className="text-xs text-neutral-700">
                                        <div>
                                            <b>Points:</b> {activeCell.count}
                                        </div>
                                        <div>
                                            <b>Sum load:</b> {activeCell.sumKw.toFixed(2)} kW
                                        </div>
                                        <div>
                                            <b>Avg load:</b>{" "}
                                            {(activeCell.sumKw / Math.max(1, activeCell.count)).toFixed(2)} kW / point
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        )}

                        {/* Point popup */}
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
                                            <b>Status:</b> {activePoint.status}
                                        </div>
                                        <div>
                                            <b>Load:</b> {activePoint.loadKw} kW ({activePoint.loadPct}%)
                                        </div>
                                        <div>
                                            <b>Updated:</b> {new Date(activePoint.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        )}
                    </MapGL>
                </div>
            </div>
        </div>
    );
}

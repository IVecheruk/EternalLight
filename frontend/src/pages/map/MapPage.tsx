import { useEffect, useMemo, useState } from "react";
import Map, { Popup, Source, Layer } from "react-map-gl/maplibre";
import type { FeatureCollection, Point } from "geojson";

import { mapApi } from "@/entities/map/api/mapApi";
import type { MapDataResponse, MapPoint } from "@/entities/map/model/types";
import { useTheme } from "@/app/theme/ThemeProvider";

type RangePreset = "1h" | "24h" | "7d";
type ViewMode = "heatmap" | "points" | "both";

function rangeToDates(preset: RangePreset) {
    const to = new Date();
    const from = new Date(to);

    if (preset === "1h") from.setHours(from.getHours() - 1);
    if (preset === "24h") from.setHours(from.getHours() - 24);
    if (preset === "7d") from.setDate(from.getDate() - 7);

    return { from: from.toISOString(), to: to.toISOString() };
}

export function MapPage() {
    const { theme } = useTheme();

    const [preset, setPreset] = useState<RangePreset>("1h");
    const [mode, setMode] = useState<ViewMode>("both");

    const [data, setData] = useState<MapDataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [active, setActive] = useState<MapPoint | null>(null);

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

    // ✅ Барнаул
    const initialViewState = useMemo(
        () => ({
            longitude: 83.7636,
            latitude: 53.3481,
            zoom: 11.5,
        }),
        []
    );

    // ✅ Под тему
    const mapStyle = useMemo(() => {
        return theme === "dark"
            ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
    }, [theme]);

    // --- GeoJSON из точек ---
    const geojson: FeatureCollection<Point, any> = useMemo(() => {
        const points = data?.points ?? [];
        return {
            type: "FeatureCollection",
            features: points.map((p) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [p.lng, p.lat],
                },
                properties: {
                    id: p.id,
                    name: p.name,
                    status: p.status,
                    loadKw: p.loadKw,
                    loadPct: p.loadPct,
                    updatedAt: p.updatedAt,
                    // weight для heatmap: чем выше, тем "горячее"
                    // можно менять на loadPct, если хочешь
                    weight: p.loadKw,
                },
            })),
        };
    }, [data]);

    // Находим max load для нормализации (чтобы heatmap был адекватным)
    const maxKw = useMemo(() => {
        const arr = data?.points?.map((p) => p.loadKw) ?? [];
        const m = arr.length ? Math.max(...arr) : 1;
        return m > 0 ? m : 1;
    }, [data]);

    // --- Слои ---
    const heatmapLayer: Layer = useMemo(
        () => ({
            id: "heat",
            type: "heatmap",
            source: "points",
            maxzoom: 16,
            paint: {
                // Вес точки
                "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["get", "weight"],
                    0,
                    0,
                    maxKw,
                    1,
                ],

                // Интенсивность по зуму
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 2.5],

                // Радиус "расплывания" по зуму
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 18, 14, 40],

                // Прозрачность (чтобы не забивала всё)
                "heatmap-opacity": mode === "points" ? 0 : 0.85,

                // Градиент цвета heatmap
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(0,0,0,0)",
                    0.2,
                    "rgba(34,197,94,0.55)", // green
                    0.45,
                    "rgba(245,158,11,0.65)", // amber
                    0.7,
                    "rgba(239,68,68,0.75)", // red
                    1,
                    "rgba(220,38,38,0.9)", // deep red
                ],
            },
        }),
        [maxKw, mode]
    );

    const circleLayer: Layer = useMemo(
        () => ({
            id: "circles",
            type: "circle",
            source: "points",
            paint: {
                // Радиус по нагрузке
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["get", "loadPct"],
                    0,
                    4,
                    100,
                    10,
                ],
                // Цвет по статусу
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
                "circle-opacity": mode === "heatmap" ? 0 : 0.85,
                "circle-stroke-color": "rgba(255,255,255,0.9)",
                "circle-stroke-width": 2,
            },
        }),
        [mode]
    );

    // Клик по карте: достаём feature и открываем popup
    const onMapClick = (e: any) => {
        // если кликнули по кругам - там будут features
        const f = e?.features?.[0];
        if (!f) {
            setActive(null);
            return;
        }

        // приводим к MapPoint (минимально нужное)
        const p: MapPoint = {
            id: f.properties.id,
            name: f.properties.name,
            status: f.properties.status,
            loadKw: Number(f.properties.loadKw),
            loadPct: Number(f.properties.loadPct),
            updatedAt: f.properties.updatedAt,
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
        };

        setActive(p);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Map</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Heatmap нагрузки освещения (mock). Источник данных: mapApi.
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
                        <option value="both">Heatmap + Points</option>
                        <option value="heatmap">Heatmap only</option>
                        <option value="points">Points only</option>
                    </select>

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

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <div className="text-sm font-medium">Barnaul heatmap</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        Tip: кликни по точке (circle), чтобы открыть popup.
                    </div>
                </div>

                <div className="h-[520px]">
                    <Map
                        initialViewState={initialViewState}
                        mapStyle={mapStyle}
                        style={{ width: "100%", height: "100%" }}
                        interactiveLayerIds={mode === "heatmap" ? [] : ["circles"]} // ✅ кликабельны круги
                        onClick={onMapClick}
                        attributionControl
                    >
                        <Source id="points" type="geojson" data={geojson}>
                            {/* heatmap снизу */}
                            <Layer {...heatmapLayer} />
                            {/* circles сверху */}
                            <Layer {...circleLayer} />
                        </Source>

                        {active && (
                            <Popup
                                longitude={active.lng}
                                latitude={active.lat}
                                anchor="top"
                                closeOnClick={false}
                                onClose={() => setActive(null)}
                            >
                                <div className="space-y-1">
                                    <div className="text-sm font-semibold">{active.name}</div>
                                    <div className="text-xs text-neutral-700">
                                        <div>
                                            <b>ID:</b> {active.id}
                                        </div>
                                        <div>
                                            <b>Status:</b> {active.status}
                                        </div>
                                        <div>
                                            <b>Load:</b> {active.loadKw} kW ({active.loadPct}%)
                                        </div>
                                        <div>
                                            <b>Updated:</b> {new Date(active.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        )}
                    </Map>
                </div>
            </div>
        </div>
    );
}

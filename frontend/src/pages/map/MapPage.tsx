import { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { mapApi } from "@/entities/map/api/mapApi";
import type { MapDataResponse, MapPoint } from "@/entities/map/model/types";
import { useTheme } from "@/app/theme/ThemeProvider";

type RangePreset = "1h" | "24h" | "7d";

function rangeToDates(preset: RangePreset) {
    const to = new Date();
    const from = new Date(to);

    if (preset === "1h") from.setHours(from.getHours() - 1);
    if (preset === "24h") from.setHours(from.getHours() - 24);
    if (preset === "7d") from.setDate(from.getDate() - 7);

    return { from: from.toISOString(), to: to.toISOString() };
}

function statusColor(s: MapPoint["status"]) {
    switch (s) {
        case "OK":
            return "#22c55e";
        case "WARN":
            return "#f59e0b";
        case "OFF":
            return "#64748b";
        case "FAULT":
            return "#ef4444";
        default:
            return "#0f172a";
    }
}

export function MapPage() {
    const { theme } = useTheme();

    const [preset, setPreset] = useState<RangePreset>("1h");
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

    // ✅ Барнаул (lng/lat)
    const initialViewState = useMemo(
        () => ({
            longitude: 83.7636,
            latitude: 53.3481,
            zoom: 11.5,
        }),
        []
    );

    // ✅ НОРМАЛЬНЫЕ стили (есть дороги/здания/подписи)
    // Light/Dark переключаем по theme
    const mapStyle = useMemo(() => {
        return theme === "dark"
            ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
    }, [theme]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Map</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Нагрузка на освещение (mock). Сейчас точки из mapApi, позже заменим на backend агрегации.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={preset}
                        onChange={(e) => setPreset(e.target.value as RangePreset)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="1h">Last 1 hour</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
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

            {/* Summary */}
            {data && (
                <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="text-xs font-semibold text-neutral-500">Points</div>
                        <div className="mt-1 text-xl font-semibold">{data.summary.points}</div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="text-xs font-semibold text-neutral-500">Faults</div>
                        <div className="mt-1 text-xl font-semibold">{data.summary.faults}</div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="text-xs font-semibold text-neutral-500">Total kW</div>
                        <div className="mt-1 text-xl font-semibold">{data.summary.totalKw}</div>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="text-xs font-semibold text-neutral-500">Range</div>
                        <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                            {new Date(data.summary.from).toLocaleString()} → {new Date(data.summary.to).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
                    <div className="text-sm font-medium">Barnaul map</div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700 dark:text-neutral-300">
                        {(["OK", "WARN", "OFF", "FAULT"] as const).map((s) => (
                            <div key={s} className="flex items-center gap-2">
                <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: statusColor(s) }}
                />
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-[520px]">
                    <Map
                        initialViewState={initialViewState}
                        mapStyle={mapStyle}
                        style={{ width: "100%", height: "100%" }}
                        onClick={() => setActive(null)}
                        attributionControl
                    >
                        {(data?.points ?? []).map((p) => {
                            const size = 10 + Math.round(p.loadPct / 10); // 10..20

                            return (
                                <Marker key={p.id} longitude={p.lng} latitude={p.lat} anchor="center">
                                    {/* ✅ Кликаем по marker без originalEvent -> TS ок */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActive(p);
                                        }}
                                        title={p.name}
                                        style={{
                                            width: size,
                                            height: size,
                                            borderRadius: 999,
                                            backgroundColor: statusColor(p.status),
                                            opacity: 0.85,
                                            border: "2px solid rgba(255,255,255,0.9)",
                                            boxShadow: "0 1px 8px rgba(0,0,0,0.15)",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Marker>
                            );
                        })}

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

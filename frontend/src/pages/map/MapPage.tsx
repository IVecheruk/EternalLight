import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { mapApi } from "@/entities/map/api/mapApi";
import type { MapPoint, MapDataResponse } from "@/entities/map/model/types";

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
    const [preset, setPreset] = useState<RangePreset>("1h");
    const [data, setData] = useState<MapDataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Барнаул (центр города)
    const center: LatLngExpression = [53.3474, 83.7788];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Map</h1>
                    <p className="text-sm text-neutral-600">
                        Нагрузка на освещение (mock). Потом заменим на backend агрегации.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={preset}
                        onChange={(e) => setPreset(e.target.value as RangePreset)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none hover:bg-neutral-50"
                    >
                        <option value="1h">Last 1 hour</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => void load()}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Loading…" : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Summary */}
            {data && (
                <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                        <div className="text-xs font-semibold text-neutral-500">Points</div>
                        <div className="mt-1 text-xl font-semibold text-neutral-900">{data.summary.points}</div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                        <div className="text-xs font-semibold text-neutral-500">Faults</div>
                        <div className="mt-1 text-xl font-semibold text-neutral-900">{data.summary.faults}</div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                        <div className="text-xs font-semibold text-neutral-500">Total kW</div>
                        <div className="mt-1 text-xl font-semibold text-neutral-900">{data.summary.totalKw}</div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                        <div className="text-xs font-semibold text-neutral-500">Range</div>
                        <div className="mt-1 text-sm text-neutral-700">
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
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
                    <div className="text-sm font-medium text-neutral-900">Барнаул — городская карта</div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700">
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
                    <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {(data?.points ?? []).map((p) => (
                            <CircleMarker
                                key={p.id}
                                center={[p.lat, p.lng]}
                                radius={4 + Math.round(p.loadPct / 25)} // 4..8
                                pathOptions={{
                                    color: statusColor(p.status),
                                    fillColor: statusColor(p.status),
                                    fillOpacity: 0.6,
                                }}
                            >
                                <Popup>
                                    <div className="space-y-1">
                                        <div className="text-sm font-semibold">{p.name}</div>
                                        <div className="text-xs text-neutral-700">
                                            <div>
                                                <b>ID:</b> {p.id}
                                            </div>
                                            <div>
                                                <b>Status:</b> {p.status}
                                            </div>
                                            <div>
                                                <b>Load:</b> {p.loadKw} kW ({p.loadPct}%)
                                            </div>
                                            <div>
                                                <b>Updated:</b> {new Date(p.updatedAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

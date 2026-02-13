import { http } from "@/shared/api/http";
import type { LightingObject } from "@/entities/lighting-object/model/types";
import { mapMockRepo } from "../mock/mapMockRepo";
import type { MapDataResponse, MapLoadParams, MapPoint, MapPointStatus } from "../model/types";

const BARNAUL_CENTER = {
    lat: 53.3474,
    lng: 83.7788,
};

function toStatus(id: number): MapPointStatus {
    if (id % 11 === 0) return "FAULT";
    if (id % 7 === 0) return "OFF";
    if (id % 3 === 0) return "WARN";
    return "OK";
}

function toLoadKw(id: number, status: MapPointStatus): number {
    if (status === "OFF") return 0;
    const base = ((id % 37) + 8) / 10;
    if (status === "FAULT") return Number((base * 0.35).toFixed(2));
    if (status === "WARN") return Number((base * 0.7).toFixed(2));
    return Number(base.toFixed(2));
}

function toPoint(object: LightingObject): MapPoint {
    const status = toStatus(object.id);
    const loadKw = toLoadKw(object.id, status);
    const loadPct = Math.max(0, Math.min(100, Math.round((loadKw / 6) * 100)));
    const hasCoords =
        typeof object.gpsLatitude === "number" &&
        typeof object.gpsLongitude === "number" &&
        (object.gpsLatitude !== 0 || object.gpsLongitude !== 0);
    const lat = hasCoords ? object.gpsLatitude! : BARNAUL_CENTER.lat;
    const lng = hasCoords ? object.gpsLongitude! : BARNAUL_CENTER.lng;

    return {
        id: String(object.id),
        name: object.poleNumber?.trim() ? `Опора №${object.poleNumber}` : `Объект #${object.id}`,
        lat,
        lng,
        status,
        loadKw,
        loadPct,
        updatedAt: new Date().toISOString(),
    };
}

export const mapApi = {
    async load(params: MapLoadParams): Promise<MapDataResponse> {
        const useMock = params.useMock ?? import.meta.env.VITE_USE_MOCK === "true";
        if (useMock) return mapMockRepo.load(params);

        const objects = await http<LightingObject[]>("/api/v1/lighting-objects", { auth: true });
        const points = objects.map(toPoint);
        const faults = points.filter((point) => point.status === "FAULT").length;
        const totalKw = Number(points.reduce((acc, point) => acc + point.loadKw, 0).toFixed(2));

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

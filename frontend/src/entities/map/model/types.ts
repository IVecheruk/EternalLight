export type MapPointStatus = "OK" | "WARN" | "OFF" | "FAULT";

export type MapPoint = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    status: MapPointStatus;
    loadKw: number;
    loadPct: number; // 0..100
    updatedAt: string;
};

export type MapDataSummary = {
    points: number;
    faults: number;
    totalKw: number;
    from: string;
    to: string;
};

export type MapDataResponse = {
    summary: MapDataSummary;
    points: MapPoint[];
};

export type MapLoadParams = {
    from: string;
    to: string;
};

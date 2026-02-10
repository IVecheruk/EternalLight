import { http } from "@/shared/api/http";
import type { WorkAct, WorkActPage, WorkActUpsertRequest } from "../model/types";

const BASE = "/api/v1/work-acts";

type ListParams = {
    page: number;
    size: number;
    actNumber?: string;
    executorOrgId?: number;
    lightingObjectId?: number;
};

function toQuery(params: ListParams): string {
    const q = new URLSearchParams();
    q.set("page", String(params.page));
    q.set("size", String(params.size));
    if (params.actNumber) q.set("actNumber", params.actNumber);
    if (params.executorOrgId) q.set("executorOrgId", String(params.executorOrgId));
    if (params.lightingObjectId) q.set("lightingObjectId", String(params.lightingObjectId));
    return q.toString();
}

export const workActApi = {
    list: (params: ListParams) => http<WorkActPage>(`${BASE}?${toQuery(params)}`, { auth: true }),
    get: (id: number) => http<WorkAct>(`${BASE}/${id}`, { auth: true }),
    create: (data: WorkActUpsertRequest) =>
        http<WorkAct>(BASE, {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        }),
    update: (id: number, data: WorkActUpsertRequest) =>
        http<WorkAct>(`${BASE}/${id}`, {
            method: "PUT",
            auth: true,
            body: JSON.stringify(data),
        }),
    remove: (id: number) => http<void>(`${BASE}/${id}`, { method: "DELETE", auth: true }),
};

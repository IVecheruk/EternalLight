import { http } from "@/shared/api/http";
import type { LightingObject, LightingObjectUpsertRequest } from "../model/types";

const BASE = "/api/v1/lighting-objects";

export const lightingObjectApi = {
    list: () => http<LightingObject[]>(BASE, { auth: true }),
    get: (id: number) => http<LightingObject>(`${BASE}/${id}`, { auth: true }),
    create: (data: LightingObjectUpsertRequest) =>
        http<LightingObject>(BASE, {
            method: "POST",
            auth: true,
            body: data,
        }),
    update: (id: number, data: LightingObjectUpsertRequest) =>
        http<LightingObject>(`${BASE}/${id}`, {
            method: "PUT",
            auth: true,
            body: data,
        }),
    remove: (id: number) => http<void>(`${BASE}/${id}`, { method: "DELETE", auth: true }),
};

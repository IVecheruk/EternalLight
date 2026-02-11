import type { Street } from "../model/types";
import { http } from "@/shared/api/http";

export type CreateStreetRequest = {
    name: string;
    districtId?: number | null;
};

export type UpdateStreetRequest = {
    name: string;
    districtId?: number | null;
};

export const streetApi = {
    async list(): Promise<Street[]> {
        return http<Street[]>("/api/v1/streets", { auth: true });
    },

    async get(id: number): Promise<Street> {
        return http<Street>(`/api/v1/streets/${id}`, { auth: true });
    },

    async create(data: CreateStreetRequest): Promise<Street> {
        return http<Street>("/api/v1/streets", {
            method: "POST",
            auth: true,
            body: data,
        });
    },

    async update(id: number, data: UpdateStreetRequest): Promise<Street> {
        return http<Street>(`/api/v1/streets/${id}`, {
            method: "PUT",
            auth: true,
            body: data,
        });
    },

    async remove(id: number): Promise<void> {
        await http<void>(`/api/v1/streets/${id}`, { method: "DELETE", auth: true });
    },
};

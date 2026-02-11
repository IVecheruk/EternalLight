import type { District } from "../model/types";
import { http } from "@/shared/api/http";

export type CreateDistrictRequest = { name: string };
export type UpdateDistrictRequest = { name: string };

export const districtApi = {
    async list(): Promise<District[]> {
        return http<District[]>("/api/v1/administrative-districts", { auth: true });
    },

    async get(id: number): Promise<District> {
        return http<District>(`/api/v1/administrative-districts/${id}`, { auth: true });
    },

    async create(data: CreateDistrictRequest): Promise<District> {
        return http<District>("/api/v1/administrative-districts", {
            method: "POST",
            auth: true,
            body: data,
        });
    },

    async update(id: number, data: UpdateDistrictRequest): Promise<District> {
        return http<District>(`/api/v1/administrative-districts/${id}`, {
            method: "PUT",
            auth: true,
            body: data,
        });
    },

    async remove(id: number): Promise<void> {
        await http<void>(`/api/v1/administrative-districts/${id}`, { method: "DELETE", auth: true });
    },
};

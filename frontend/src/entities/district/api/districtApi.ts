import type { District } from "../model/types";
import { districtMockRepo } from "../mock/districtMockRepo";
import { http } from "@/shared/api/http";

export type CreateDistrictRequest = { name: string };
export type UpdateDistrictRequest = { name: string };

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const districtApi = {
    async list(): Promise<District[]> {
        if (USE_MOCK) return districtMockRepo.list();
        return http<District[]>("/api/v1/administrative-districts", { auth: true });
    },

    async create(data: CreateDistrictRequest): Promise<District> {
        if (USE_MOCK) return districtMockRepo.create(data);
        return http<District>("/api/v1/administrative-districts", {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        });
    },

    async update(id: number, data: UpdateDistrictRequest): Promise<District> {
        if (USE_MOCK) return districtMockRepo.update(id, data);
        return http<District>(`/api/v1/administrative-districts/${id}`, {
            method: "PUT",
            auth: true,
            body: JSON.stringify(data),
        });
    },

    async remove(id: number): Promise<void> {
        if (USE_MOCK) return districtMockRepo.remove(id);
        await http<void>(`/api/v1/administrative-districts/${id}`, { method: "DELETE", auth: true });
    },
};

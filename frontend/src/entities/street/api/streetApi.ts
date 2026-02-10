import type { Street } from "../model/types";
import { streetMockRepo } from "../mock/streetMockRepo";
import { http } from "@/shared/api/http";

export type CreateStreetRequest = {
    name: string;
    districtId: number | null;
};

export type UpdateStreetRequest = {
    name: string;
    districtId: number | null;
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const streetApi = {
    async list(): Promise<Street[]> {
        if (USE_MOCK) return streetMockRepo.list();
        return http<Street[]>("/api/v1/streets", { auth: true });
    },

    async create(data: CreateStreetRequest): Promise<Street> {
        if (USE_MOCK) return streetMockRepo.create(data);
        return http<Street>("/api/v1/streets", {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        });
    },

    async update(id: number, data: UpdateStreetRequest): Promise<Street> {
        if (USE_MOCK) return streetMockRepo.update(id, data);
        return http<Street>(`/api/v1/streets/${id}`, {
            method: "PUT",
            auth: true,
            body: JSON.stringify(data),
        });
    },

    async remove(id: number): Promise<void> {
        if (USE_MOCK) return streetMockRepo.remove(id);
        await http<void>(`/api/v1/streets/${id}`, { method: "DELETE", auth: true });
    },
};

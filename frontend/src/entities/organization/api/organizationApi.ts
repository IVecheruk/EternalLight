import type { Organization } from "../model/types";
import { organizationMockRepo } from "../mock/organizationMockRepo";
import { http } from "@/shared/api/http";

export type CreateOrganizationRequest = {
    fullName: string;
    city: string | null;
};

export type UpdateOrganizationRequest = {
    fullName: string;
    city: string | null;
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const organizationApi = {
    async list(): Promise<Organization[]> {
        if (USE_MOCK) return organizationMockRepo.list();
        return http<Organization[]>("/api/v1/organizations", { auth: true });
    },

    async create(data: CreateOrganizationRequest): Promise<Organization> {
        if (USE_MOCK) return organizationMockRepo.create(data);
        return http<Organization>("/api/v1/organizations", {
            method: "POST",
            auth: true,
            body: JSON.stringify(data),
        });
    },

    async update(id: number, data: UpdateOrganizationRequest): Promise<Organization> {
        if (USE_MOCK) return organizationMockRepo.update(id, data);
        return http<Organization>(`/api/v1/organizations/${id}`, {
            method: "PUT",
            auth: true,
            body: JSON.stringify(data),
        });
    },

    async remove(id: number): Promise<void> {
        if (USE_MOCK) return organizationMockRepo.remove(id);
        await http<void>(`/api/v1/organizations/${id}`, { method: "DELETE", auth: true });
    },
};

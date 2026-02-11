import type { Organization } from "../model/types";
import { http } from "@/shared/api/http";

export type CreateOrganizationRequest = {
    fullName: string;
    city: string | null;
};

export type UpdateOrganizationRequest = {
    fullName: string;
    city: string | null;
};

export const organizationApi = {
    async list(): Promise<Organization[]> {
        return http<Organization[]>("/api/v1/organizations", { auth: true });
    },

    async get(id: number) {
        return http<Organization>(`/api/v1/organizations/${id}`, { auth: true });
    },

    async create(data: CreateOrganizationRequest): Promise<Organization> {
        return http<Organization>("/api/v1/organizations", {
            method: "POST",
            auth: true,
            body: data,
        });
    },

    async update(id: number, data: UpdateOrganizationRequest): Promise<Organization> {
        return http<Organization>(`/api/v1/organizations/${id}`, {
            method: "PUT",
            auth: true,
            body: data,
        });
    },

    async remove(id: number): Promise<void> {
        await http<void>(`/api/v1/organizations/${id}`, { method: "DELETE", auth: true });
    },
};

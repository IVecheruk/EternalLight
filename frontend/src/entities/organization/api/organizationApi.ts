import { http } from "@/shared/api/http";
import type { Organization } from "../model/types";

export type CreateOrganizationRequest = {
    fullName: string;
    city?: string | null;
};

export const organizationApi = {
    async list(): Promise<Organization[]> {
        const res = await http.get<Organization[]>("/api/v1/organizations");
        return res.data;
    },

    async create(data: CreateOrganizationRequest): Promise<Organization> {
        const res = await http.post<Organization>("/api/v1/organizations", data);
        return res.data;
    },

    async remove(id: number): Promise<void> {
        await http.delete(`/api/v1/organizations/${id}`);
    },
};

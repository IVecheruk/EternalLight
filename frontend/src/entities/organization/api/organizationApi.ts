import { http } from "@/shared/api/http";
import type { Organization } from "../model/types";

const BASE = "/api/v1/organizations";

export type CreateOrganizationRequest = {
    fullName: string;
    city?: string | null;
};

export const organizationApi = {
    list: () => http<Organization[]>(BASE, { method: "GET" }),

    create: (data: CreateOrganizationRequest) =>
        http<Organization>(BASE, { method: "POST", data }),

    remove: (id: number) =>
        http<void>(`${BASE}/${id}`, { method: "DELETE" }),
};

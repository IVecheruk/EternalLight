import { http } from "@/shared/api/http";

export type AdministrativeDistrict = {
    id: number;
    name: string;
};

export type CreateAdministrativeDistrictRequest = {
    name: string;
};

export type UpdateAdministrativeDistrictRequest = {
    name: string;
};

const BASE = "/api/v1/administrative-districts";

export const administrativeDistrictApi = {
    list(): Promise<AdministrativeDistrict[]> {
        return http<AdministrativeDistrict[]>(BASE, { method: "GET", auth: true });
    },

    get(id: number): Promise<AdministrativeDistrict> {
        return http<AdministrativeDistrict>(`${BASE}/${id}`, { method: "GET", auth: true });
    },

    create(data: CreateAdministrativeDistrictRequest): Promise<AdministrativeDistrict> {
        return http<AdministrativeDistrict>(BASE, {
            method: "POST",
            auth: true,
            body: data,
        });
    },

    update(id: number, data: UpdateAdministrativeDistrictRequest): Promise<AdministrativeDistrict> {
        return http<AdministrativeDistrict>(`${BASE}/${id}`, {
            method: "PUT",
            auth: true,
            body: data,
        });
    },

    remove(id: number): Promise<void> {
        return http<void>(`${BASE}/${id}`, { method: "DELETE", auth: true });
    },
};

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
        return http<AdministrativeDistrict[]>(BASE, { method: "GET", auth: false });
    },

    get(id: number): Promise<AdministrativeDistrict> {
        return http<AdministrativeDistrict>(`${BASE}/${id}`, { method: "GET", auth: false });
    },

    create(data: CreateAdministrativeDistrictRequest): Promise<AdministrativeDistrict> {
        return http<AdministrativeDistrict>(BASE, {
            method: "POST",
            auth: false,
            body: JSON.stringify(data),
        });
    },

    update(id: number, data: UpdateAdministrativeDistrictRequest): Promise<AdministrativeDistrict> {
        return http<AdministrativeDistrict>(`${BASE}/${id}`, {
            method: "PUT",
            auth: false,
            body: JSON.stringify(data),
        });
    },

    remove(id: number): Promise<void> {
        return http<void>(`${BASE}/${id}`, { method: "DELETE", auth: false });
    },
};

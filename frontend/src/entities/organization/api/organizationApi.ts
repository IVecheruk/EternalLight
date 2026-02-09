import axios from "axios";
import type { Organization } from "../model/types";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
});

// если ты используешь JWT в localStorage:
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export type CreateOrganizationRequest = { fullName: string; city?: string | null };
export type UpdateOrganizationRequest = { fullName: string; city?: string | null };

export const organizationApi = {
    async list(): Promise<Organization[]> {
        const res = await api.get("/api/v1/organizations");
        return res.data;
    },

    async create(data: CreateOrganizationRequest): Promise<Organization> {
        const res = await api.post("/api/v1/organizations", data);
        return res.data;
    },

    async update(id: number, data: UpdateOrganizationRequest): Promise<Organization> {
        const res = await api.put(`/api/v1/organizations/${id}`, data);
        return res.data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/api/v1/organizations/${id}`);
    },
};

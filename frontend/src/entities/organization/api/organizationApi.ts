import axios from "axios";
import type { Organization } from "../model/types";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const organizationApi = {
    async list(): Promise<Organization[]> {
        const res = await api.get("/api/v1/organizations");
        return res.data;
    },

    async create(data: {
        fullName: string;
        city?: string;
    }): Promise<Organization> {
        const res = await api.post("/api/v1/organizations", data);
        return res.data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/api/v1/organizations/${id}`);
    },
};

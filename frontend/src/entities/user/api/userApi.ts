import { http } from "@/shared/api/http";

export type SystemUser = {
    id: number;
    email: string;
    roles?: string[];
    role?: string;
    authorities?: string;
    fullName?: string | null;
    active?: boolean;
    blockedReason?: string | null;
};

export const userApi = {
    async list(): Promise<SystemUser[]> {
        const data = await http<unknown>("/api/v1/users", { auth: true });
        if (Array.isArray(data)) return data as SystemUser[];
        const page = data as { content?: SystemUser[] } | null;
        if (page?.content && Array.isArray(page.content)) return page.content;
        return [];
    },

    async updateRole(id: number, role: string): Promise<SystemUser> {
        return http<SystemUser>(`/api/v1/users/${id}/role`, {
            method: "PUT",
            auth: true,
            body: { role },
        });
    },

    async updateStatus(id: number, active: boolean, reason?: string): Promise<SystemUser> {
        return http<SystemUser>(`/api/v1/users/${id}/status`, {
            method: "PUT",
            auth: true,
            body: { active, reason },
        });
    },
};

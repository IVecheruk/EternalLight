import { apiClient } from "./apiClient";
import type { User } from "@/entities/user/model/types";

export type LoginRequest = {
    email: string;
    password: string;
};

export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
};

export const authApi = {
    async login(payload: LoginRequest): Promise<TokenResponse> {
        const res = await apiClient.post("/api/v1/auth/login", payload);
        return res.data;
    },

    async refresh(refreshToken: string): Promise<TokenResponse> {
        const res = await apiClient.post("/api/v1/auth/refresh", { refreshToken });
        return res.data;
    },

    async logout(refreshToken: string): Promise<void> {
        await apiClient.post("/api/v1/auth/logout", { refreshToken });
    },

    async me(): Promise<User> {
        const res = await apiClient.get("/api/v1/auth/me");
        return res.data;
    },
};

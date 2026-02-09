import { http } from "@/shared/api/http";
import type { LoginRequest, RegisterRequest, TokenResponse, MeResponse } from "./types";

const BASE = "/api/v1/auth";

export const authApi = {
    login: (dto: LoginRequest) =>
        http<TokenResponse>(`${BASE}/login`, {
            method: "POST",
            data: dto,
        }),

    register: (dto: RegisterRequest) =>
        http<TokenResponse>(`${BASE}/register`, {
            method: "POST",
            data: dto,
        }),

    me: () => http<MeResponse>(`${BASE}/me`, { method: "GET" }),
};

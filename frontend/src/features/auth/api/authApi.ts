import { http } from "@/shared/api/http";
import type { LoginRequest, TokenResponse, MeResponse } from "./types";

const BASE = "/api/v1/auth";

export const authApi = {
    login: (dto: LoginRequest) =>
        http<TokenResponse>(`${BASE}/login`, {
            method: "POST",
            body: JSON.stringify(dto),
            auth: false,
        }),
    me: () => http<MeResponse>(`${BASE}/me`, { method: "GET", auth: true }),
};

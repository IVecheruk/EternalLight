import { http } from "@/shared/api/http";
import type { LoginRequest, RegisterRequest, TokenResponse, MeResponse } from "./types";

export const authApi = {
    async login(dto: LoginRequest): Promise<TokenResponse> {
        const res = await http.post<TokenResponse>("/api/auth/login", dto);
        return res.data;
    },

    async register(dto: RegisterRequest): Promise<TokenResponse> {
        const res = await http.post<TokenResponse>("/api/auth/register", dto);
        return res.data;
    },

    async me(): Promise<MeResponse> {
        const res = await http.get<MeResponse>("/api/auth/me");
        return res.data;
    },
};

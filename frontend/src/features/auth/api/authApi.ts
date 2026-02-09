import { http } from "../../../shared/api/http";
import type { LoginRequest, RegisterRequest, TokenResponse, MeResponse } from "./types";

export const authApi = {
    async login(body: LoginRequest): Promise<TokenResponse> {
        const { data } = await http.post<TokenResponse>("/api/v1/auth/login", body);
        return data;
    },

    async register(body: RegisterRequest): Promise<TokenResponse> {
        const { data } = await http.post<TokenResponse>("/api/v1/auth/register", body);
        return data;
    },

    async me(): Promise<MeResponse> {
        const { data } = await http.get<MeResponse>("/api/v1/auth/me");
        return data;
    },
};

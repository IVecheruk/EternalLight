import { http } from "@/shared/api/http";
import type {
    LoginRequest,
    UpdateProfileRequest,
    MeResponse,
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
} from "./types";

const BASE = "/api/v1/auth";

export const authApi = {
    login: (dto: LoginRequest) =>
        http<TokenResponse>(`${BASE}/login`, {
            method: "POST",
            body: dto,
            auth: false,
        }),
    register: (dto: RegisterRequest) =>
        http<RegisterResponse>(`${BASE}/register`, {
            method: "POST",
            body: dto,
            auth: false,
        }),
    updateProfile: (dto: UpdateProfileRequest) =>
        http<MeResponse>(`${BASE}/me`, {
            method: "PUT",
            body: dto,
            auth: true,
        }),
    me: () => http<MeResponse>(`${BASE}/me`, { method: "GET", auth: true }),
};

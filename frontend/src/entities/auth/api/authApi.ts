import { http } from "@/shared/api/http";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    MeResponse,
} from "./types";

export const authApi = {
    login(dto: LoginRequest) {
        return http<LoginResponse>("/api/v1/auth/login", {
            method: "POST",
            body: dto,
        });
    },

    register(dto: RegisterRequest) {
        return http<RegisterResponse>("/api/v1/auth/register", {
            method: "POST",
            body: dto,
        });
    },

    me() {
        return http<MeResponse>("/api/v1/auth/me", {
            method: "GET",
            auth: true,
        });
    },
};

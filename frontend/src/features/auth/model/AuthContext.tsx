import { createContext } from "react";
import type { LoginRequest, RegisterRequest, MeResponse } from "@/features/auth/api/types";

export type AuthContextValue = {
    isReady: boolean;
    isAuthenticated: boolean;
    user: MeResponse | null;

    login: (dto: LoginRequest) => Promise<void>;
    register: (dto: RegisterRequest) => Promise<void>;

    logout: () => void;
    refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

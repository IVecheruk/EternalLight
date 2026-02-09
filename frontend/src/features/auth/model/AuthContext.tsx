import { createContext } from "react";
import type { LoginRequest, MeResponse } from "../api/types";

export type AuthState = {
    isReady: boolean;
    isAuthenticated: boolean;
    user: MeResponse | null;
};

export type AuthContextValue = AuthState & {
    login: (dto: LoginRequest) => Promise<void>;
    logout: () => void;
    refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

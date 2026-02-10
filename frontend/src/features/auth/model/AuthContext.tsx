import { createContext } from "react";

export type MeResponse = {
    email: string;
    role?: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type AuthContextValue = {
    isReady: boolean;
    isAuthenticated: boolean;
    user: MeResponse | null;
    login: (dto: LoginRequest) => Promise<void>;
    logout: () => void;
    refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

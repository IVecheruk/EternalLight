import { createContext } from "react";

export type MeResponse = {
    email: string;
    authorities?: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type AuthContextValue = {
    isReady: boolean;
    isAuthenticated: boolean;
    user: MeResponse | null;
    roles: string[];
    hasRole: (...roles: string[]) => boolean;
    login: (dto: LoginRequest) => Promise<void>;
    logout: () => void;
    refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

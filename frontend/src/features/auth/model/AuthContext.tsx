import { createContext } from "react";

export type MeResponse = {
    email: string;
    authorities?: string;
};

export type Role = "SUPER_ADMIN" | "ORG_ADMIN" | "DISPATCHER" | "TECHNICIAN";

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
    role: Role;
};

export type AuthContextValue = {
    isReady: boolean;
    isAuthenticated: boolean;
    user: MeResponse | null;
    roles: string[];
    hasRole: (...roles: string[]) => boolean;
    register: (dto: RegisterRequest) => Promise<void>;
    login: (dto: LoginRequest) => Promise<void>;
    logout: () => void;
    refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

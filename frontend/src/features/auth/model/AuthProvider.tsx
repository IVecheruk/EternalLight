import React, { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "@/features/auth/api/authApi";
import type { LoginRequest, RegisterRequest, MeResponse } from "@/features/auth/api/types";
import { AuthContext, type AuthContextValue } from "./AuthContext";

const TOKEN_KEY = "accessToken";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState<MeResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const refreshMe = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            return;
        }

        try {
            const me = await authApi.me();
            setUser(me);
            setIsAuthenticated(true);
        } catch {
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const login = useCallback(
        async (dto: LoginRequest) => {
            const res = await authApi.login(dto);
            const token = res.accessToken ?? res.token;
            if (!token) throw new Error("Missing access token");
            localStorage.setItem(TOKEN_KEY, token);
            await refreshMe();
        },
        [refreshMe]
    );

    // регистрация без роли, роль назначит админ
    const register = useCallback(
        async (dto: RegisterRequest) => {
            await authApi.register(dto);
            await login({ email: dto.email, password: dto.password });
        },
        [login]
    );

    useEffect(() => {
        void (async () => {
            await refreshMe();
            setIsReady(true);
        })();
    }, [refreshMe]);

    const value = useMemo<AuthContextValue>(
        () => ({
            isReady,
            isAuthenticated,
            user,
            login,
            register,
            logout,
            refreshMe,
        }),
        [isReady, isAuthenticated, user, login, register, logout, refreshMe]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import type { LoginRequest, MeResponse } from "../api/types";
import { AuthContext, type AuthContextValue } from "./AuthContext";

const TOKEN_KEY = "accessToken";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState<MeResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!localStorage.getItem(TOKEN_KEY);
    });

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const refreshMe = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY);

        // токена нет -> точно не авторизован
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        // токен есть -> пробуем получить пользователя
        try {
            const me = await authApi.me();
            setUser(me);
            setIsAuthenticated(true);
        } catch {
            // /me не пускает -> токен битый/протух/не отправился
            logout();
        }
    }, [logout]);

    const login = useCallback(
        async (dto: LoginRequest) => {
            const res = await authApi.login(dto);
            localStorage.setItem(TOKEN_KEY, res.token);

            // сначала ставим флаг, затем тянем /me
            setIsAuthenticated(true);
            await refreshMe();
        },
        [refreshMe]
    );

    useEffect(() => {
        (async () => {
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
            logout,
            refreshMe,
        }),
        [isReady, isAuthenticated, user, login, logout, refreshMe]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

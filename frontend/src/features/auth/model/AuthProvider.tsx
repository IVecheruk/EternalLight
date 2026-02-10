import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { LoginRequest } from "./AuthContext";
import { authApi } from "../api/authApi";
import type { MeResponse } from "../api/types";

const TOKEN_KEY = "accessToken";

/**
 * Важно: даже если backend сейчас даёт 403/400 — фронт не должен падать.
 * Он просто будет считать юзера гостем и жить дальше.
 */
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
            // токен плохой или не отправился — сбрасываем
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const login = useCallback(
        async (dto: LoginRequest) => {
            const res = await authApi.login(dto);
            localStorage.setItem(TOKEN_KEY, res.token);
            setIsAuthenticated(true);
            await refreshMe();
        },
        [refreshMe]
    );

    useEffect(() => {
        void (async () => {
            await refreshMe();
            setIsReady(true);
        })();
    }, [refreshMe]);

    const value = useMemo(
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { LoginRequest, RegisterRequest } from "./AuthContext";
import { authApi } from "../api/authApi";
import type { MeResponse } from "../api/types";

const TOKEN_KEY = "accessToken";

function parseAuthorities(raw?: string): string[] {
    if (!raw) return [];
    return raw
        .replace(/[[\]]/g, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^ROLE_/, "").toUpperCase());
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState<MeResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    /**
     * tolerant режим: если /me недоступен, но токен есть — не выбрасываем пользователя
     * из сессии (backend может быть в промежуточной конфигурации).
     */
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


    const register = useCallback(
        async (dto: RegisterRequest) => {
            const res = await authApi.register(dto);
            localStorage.setItem(TOKEN_KEY, res.token);
            setIsAuthenticated(true);
            await refreshMe();
        },
        [refreshMe]
    );
    const login = useCallback(
        async (dto: LoginRequest) => {
            const res = await authApi.login(dto);
            localStorage.setItem(TOKEN_KEY, res.token);
            setIsAuthenticated(true);
            setUser({ email: dto.email });
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

    const roles = useMemo(() => parseAuthorities(user?.authorities), [user?.authorities]);

    const hasRole = useCallback(
        (...expectedRoles: string[]) => {
            if (expectedRoles.length === 0) return true;
            if (!isAuthenticated) return false;
            return expectedRoles.some((role) => roles.includes(role.toUpperCase()));
        },
        [isAuthenticated, roles]
    );

    const value = useMemo(
        () => ({
            isReady,
            isAuthenticated,
            user,
            roles,
            hasRole,
            register,
            login,
            logout,
            refreshMe,
        }),
        [isReady, isAuthenticated, user, roles, hasRole, register, login, logout, refreshMe]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

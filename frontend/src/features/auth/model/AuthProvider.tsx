import React, { useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import type { LoginRequest, MeResponse } from "../api/types";
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
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const me = await authApi.me();
            setUser(me);
        } catch {
            // если /me не пускает -> значит токен плохой/не отправился
            localStorage.removeItem("accessToken");
            setUser(null);
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

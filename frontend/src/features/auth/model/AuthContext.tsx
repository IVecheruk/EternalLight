import React, { createContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/entities/user/model/types";
import { authApi } from "@/shared/api/authApi";
import { setAccessToken } from "@/shared/api/apiClient";

type AuthState = {
    user: User | null;
    isLoading: boolean;
    isAuthed: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

const REFRESH_KEY = "eternallight.refreshToken";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshMe = async () => {
        try {
            const me = await authApi.me();
            setUser(me);
        } catch {
            setUser(null);
        }
    };

    const tryRefresh = async () => {
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        if (!refreshToken) return false;

        try {
            const tokens = await authApi.refresh(refreshToken);
            setAccessToken(tokens.accessToken);
            localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
            return true;
        } catch {
            localStorage.removeItem(REFRESH_KEY);
            setAccessToken(null);
            return false;
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const tokens = await authApi.login({ email, password });
            setAccessToken(tokens.accessToken);
            localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
            await refreshMe();
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        try {
            if (refreshToken) await authApi.logout(refreshToken);
        } catch {
            // игнор
        } finally {
            localStorage.removeItem(REFRESH_KEY);
            setAccessToken(null);
            setUser(null);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // при старте: пробуем refresh -> me
        (async () => {
            const ok = await tryRefresh();
            if (ok) await refreshMe();
            setIsLoading(false);
        })();
    }, []);

    const value = useMemo<AuthState>(
        () => ({
            user,
            isLoading,
            isAuthed: !!user,
            login,
            logout,
            refreshMe,
        }),
        [user, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

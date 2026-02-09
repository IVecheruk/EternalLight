import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

type Props = { children: React.ReactNode };

export const RequireAuth: React.FC<Props> = ({ children }) => {
    const { isReady, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isReady) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return <>{children}</>;
};

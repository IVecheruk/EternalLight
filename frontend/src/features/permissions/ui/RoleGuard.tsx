import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

type Props = {
    roles: string[];
    children: React.ReactNode;
    fallbackPath?: string;
};

export function RoleGuard({ roles, children, fallbackPath = "/" }: Props) {
    const { isReady, isAuthenticated, hasRole } = useAuth();

    if (!isReady) return <div className="text-sm text-neutral-500">Loading permissions...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!hasRole(...roles)) return <Navigate to={fallbackPath} replace />;

    return <>{children}</>;
}

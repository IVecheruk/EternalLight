import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import { usePermissions } from "@/features/permissions/model/usePermissions";

type Props = {
    roles: readonly string[];
    children: React.ReactNode;
    fallbackPath?: string;
    allowUserPreview?: boolean;
};

export function RoleGuard({ roles, children, fallbackPath = "/", allowUserPreview = false }: Props) {
    const { isReady, isAuthenticated, hasRole } = useAuth();
    const { isViewerOnly } = usePermissions();

    if (!isReady) return <div className="text-sm text-neutral-500">Загрузка прав доступа...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!hasRole(...roles)) {
        if (allowUserPreview && isViewerOnly) return <>{children}</>;
        return <Navigate to={fallbackPath} replace />;
    }

    return <>{children}</>;
}

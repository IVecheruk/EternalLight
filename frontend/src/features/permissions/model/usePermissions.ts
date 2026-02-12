import { useMemo } from "react";
import { useAuth } from "@/features/auth/model/useAuth";
import { SYSTEM_ROLES } from "./roles";

export function usePermissions() {
    const { isAuthenticated, roles, hasRole } = useAuth();

    return useMemo(() => {
        const isSuperAdmin = hasRole(SYSTEM_ROLES.SUPER_ADMIN);
        const isAdmin = hasRole(SYSTEM_ROLES.ADMIN);
        const isTechnician = hasRole(SYSTEM_ROLES.TECHNICIAN);
        const hasAnyRole = roles.length > 0;
        const isUser = hasRole(SYSTEM_ROLES.USER) || !hasAnyRole;
        const isViewerOnly = isUser && !isSuperAdmin && !isAdmin && !isTechnician;

        const canManageUsers = isSuperAdmin;
        const canManageDictionaries = isAdmin || isSuperAdmin;
        const canManageActs = isTechnician || isAdmin || isSuperAdmin;
        const canAccessAdmin = isAdmin || isSuperAdmin;
        const canAccessMap = isTechnician || isAdmin || isSuperAdmin;

        return {
            isAuthenticated,
            roles,
            isSuperAdmin,
            isAdmin,
            isTechnician,
            isUser,
            isViewerOnly,
            canManageUsers,
            canManageDictionaries,
            canManageActs,
            canAccessAdmin,
            canAccessMap,
        };
    }, [hasRole, isAuthenticated, roles]);
}

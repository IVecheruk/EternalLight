import { useMemo } from "react";
import { useAuth } from "@/features/auth/model/useAuth";

export const SYSTEM_ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ORG_ADMIN: "ORG_ADMIN",
    DISPATCHER: "DISPATCHER",
    TECHNICIAN: "TECHNICIAN",
    VIEWER: "VIEWER",
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export function usePermissions() {
    const { isAuthenticated, roles, hasRole } = useAuth();

    return useMemo(() => {
        const isSuperAdmin = hasRole(SYSTEM_ROLES.SUPER_ADMIN, "ADMIN");
        const isOrgAdmin = hasRole(SYSTEM_ROLES.ORG_ADMIN, "ADMIN");
        const canManageUsers = isSuperAdmin || isOrgAdmin;
        const canManageDictionaries = isSuperAdmin || isOrgAdmin;
        const canManageActs = hasRole(
            SYSTEM_ROLES.SUPER_ADMIN,
            SYSTEM_ROLES.ORG_ADMIN,
            SYSTEM_ROLES.DISPATCHER,
            SYSTEM_ROLES.TECHNICIAN,
            "ADMIN"
        );

        return {
            isAuthenticated,
            roles,
            isSuperAdmin,
            isOrgAdmin,
            canManageUsers,
            canManageDictionaries,
            canManageActs,
        };
    }, [hasRole, isAuthenticated, roles]);
}

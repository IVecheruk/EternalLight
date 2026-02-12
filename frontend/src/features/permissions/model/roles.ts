export const SYSTEM_ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    TECHNICIAN: "TECHNICIAN",
    USER: "USER",
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

const ROLE_ALIASES: Record<string, SystemRole> = {
    ORG_ADMIN: SYSTEM_ROLES.ADMIN,
    DISPATCHER: SYSTEM_ROLES.TECHNICIAN,
};

export const ADMIN_ROLES = [SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.SUPER_ADMIN] as const;
export const TECHNICIAN_ROLES = [SYSTEM_ROLES.TECHNICIAN, SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.SUPER_ADMIN] as const;
export const SUPER_ADMIN_ROLES = [SYSTEM_ROLES.SUPER_ADMIN] as const;

export function normalizeRoleName(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    const withoutPrefix = trimmed.startsWith("ROLE_") ? trimmed.slice(5) : trimmed;
    const upper = withoutPrefix.toUpperCase();
    return ROLE_ALIASES[upper] ?? upper;
}

export function toRoleVariants(raw: string): string[] {
    const normalized = normalizeRoleName(raw);
    if (!normalized) return [];
    return [normalized, `ROLE_${normalized}`];
}

export function parseAuthorities(authorities?: string): string[] {
    if (!authorities) return [];
    const cleaned = authorities.replace(/^\[|\]$/g, "");
    return cleaned
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
}

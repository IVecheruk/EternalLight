package com.eternallight.backend.infrastructure.security;

import java.util.Map;
import java.util.Set;

public final class RoleUtils {

    public static final String SUPER_ADMIN = "SUPER_ADMIN";
    public static final String ADMIN = "ADMIN";
    public static final String TECHNICIAN = "TECHNICIAN";
    public static final String USER = "USER";

    private static final Map<String, String> ALIASES = Map.of(
            "ORG_ADMIN", ADMIN,
            "DISPATCHER", TECHNICIAN
    );

    private static final Set<String> ALLOWED = Set.of(
            SUPER_ADMIN,
            ADMIN,
            TECHNICIAN,
            USER
    );

    private RoleUtils() {}

    public static String normalize(String raw) {
        if (raw == null) return "";
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) return "";
        if (trimmed.startsWith("ROLE_")) {
            trimmed = trimmed.substring(5);
        }
        String upper = trimmed.toUpperCase();
        return ALIASES.getOrDefault(upper, upper);
    }

    public static String requireAllowed(String raw) {
        String normalized = normalize(raw);
        if (!ALLOWED.contains(normalized)) {
            throw new IllegalArgumentException("Unsupported role. Allowed roles: " + ALLOWED);
        }
        return normalized;
    }

    public static boolean isAllowed(String raw) {
        return ALLOWED.contains(normalize(raw));
    }
}

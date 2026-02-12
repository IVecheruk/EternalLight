package com.eternallight.backend.api.dto.response;

import java.util.List;

public record UserResponse(
        Long id,
        String email,
        List<String> roles,
        String fullName,
        boolean active,
        String blockedReason
) {}

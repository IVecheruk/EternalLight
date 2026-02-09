package com.eternallight.backend.api.dto.auth;

import java.util.List;

public record MeResponse(
        Long id,
        String email,
        List<String> roles
) {}

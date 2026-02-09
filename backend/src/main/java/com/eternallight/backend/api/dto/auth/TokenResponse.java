package com.eternallight.backend.api.dto.auth;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}

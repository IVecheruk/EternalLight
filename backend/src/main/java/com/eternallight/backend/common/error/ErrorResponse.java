package com.eternallight.backend.common.error;

public record ErrorResponse(
        String code,
        String message
) {
}
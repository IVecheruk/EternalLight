package com.eternallight.backend.api.dto.response;

public record WorkActPerformedWorkResponse(
        Long id,
        Long workActId,
        Integer seq,
        String description
) {}

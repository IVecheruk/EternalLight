package com.eternallight.backend.api.dto.response;

public record FaultTypeResponse(
        Long id,
        String code,
        String name,
        Boolean isOther
) {}

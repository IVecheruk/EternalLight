package com.eternallight.backend.api.dto.response;

public record WorkActFaultResponse(
        Long id,
        Long workActId,
        Long faultTypeId,
        Boolean isSelected,
        String otherText
) {}

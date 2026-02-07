package com.eternallight.backend.api.dto.request;

public record UpdateWorkActFaultRequest(
        Boolean isSelected,
        String otherText
) {}

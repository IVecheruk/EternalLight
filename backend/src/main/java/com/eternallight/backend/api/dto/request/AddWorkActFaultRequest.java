package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddWorkActFaultRequest(
        @NotNull @Positive Long faultTypeId,
        Boolean isSelected,
        String otherText
) {}

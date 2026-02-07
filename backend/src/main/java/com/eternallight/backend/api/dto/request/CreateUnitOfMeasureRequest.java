package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateUnitOfMeasureRequest(
        @NotBlank String name
) {}

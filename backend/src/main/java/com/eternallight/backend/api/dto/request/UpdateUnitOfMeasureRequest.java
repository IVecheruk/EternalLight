package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateUnitOfMeasureRequest(
        @NotBlank String name
) {}

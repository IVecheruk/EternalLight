package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateStreetRequest(
        @NotBlank String name,
        @Positive Long districtId
) {}

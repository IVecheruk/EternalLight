package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UpdateStreetRequest(
        @NotBlank String name,
        @Positive Long districtId
) {}

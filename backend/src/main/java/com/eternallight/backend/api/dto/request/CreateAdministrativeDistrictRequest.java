package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateAdministrativeDistrictRequest(
        @NotBlank String name
) {}
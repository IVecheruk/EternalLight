package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateBrigadeRoleRequest(
        @NotBlank String code,
        @NotBlank String name
) {}

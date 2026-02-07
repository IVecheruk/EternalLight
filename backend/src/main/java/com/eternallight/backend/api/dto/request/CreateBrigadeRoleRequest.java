package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateBrigadeRoleRequest(
        @NotBlank String code,
        @NotBlank String name
) {}

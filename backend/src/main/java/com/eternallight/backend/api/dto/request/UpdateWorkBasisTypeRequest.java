package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateWorkBasisTypeRequest(
        @NotBlank String code,
        @NotBlank String name
) {}

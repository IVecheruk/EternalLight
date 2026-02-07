package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateFaultTypeRequest(
        @NotBlank String code,
        @NotBlank String name,
        Boolean isOther
) {}

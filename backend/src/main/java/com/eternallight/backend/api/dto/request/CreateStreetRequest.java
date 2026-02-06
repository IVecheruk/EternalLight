package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateStreetRequest(
        @NotBlank String name
) {}

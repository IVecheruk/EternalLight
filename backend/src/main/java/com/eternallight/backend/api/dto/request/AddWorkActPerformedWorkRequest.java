package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddWorkActPerformedWorkRequest(
        @NotNull @Positive Integer seq,
        @NotBlank String description
) {}

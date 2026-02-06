package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record AddWorkActBasisRequest(
        @NotNull @Positive Long workBasisTypeId,
        Boolean isSelected,
        String documentNumber,
        LocalDate documentDate
) {}

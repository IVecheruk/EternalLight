package com.eternallight.backend.api.dto.response;

import java.time.LocalDate;

public record WorkActBasisResponse(
        Long id,
        Long workActId,
        Long workBasisTypeId,
        Boolean isSelected,
        String documentNumber,
        LocalDate documentDate
) {}

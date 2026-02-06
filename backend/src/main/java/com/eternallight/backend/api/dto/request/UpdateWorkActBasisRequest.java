package com.eternallight.backend.api.dto.request;

import java.time.LocalDate;

public record UpdateWorkActBasisRequest(
        Boolean isSelected,
        String documentNumber,
        LocalDate documentDate
) {}

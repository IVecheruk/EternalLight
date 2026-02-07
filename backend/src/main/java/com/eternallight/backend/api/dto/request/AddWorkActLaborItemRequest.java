package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record AddWorkActLaborItemRequest(
        Integer seq,
        @NotBlank String workTypeName,
        Long uomId,
        BigDecimal workVolume,
        BigDecimal normHours,
        BigDecimal actualHours,
        BigDecimal rateAmount,
        BigDecimal costAmount
) {}

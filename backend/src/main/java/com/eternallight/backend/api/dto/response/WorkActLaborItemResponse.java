package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;

public record WorkActLaborItemResponse(
        Long id,
        Long workActId,
        Integer seq,
        String workTypeName,
        Long uomId,
        BigDecimal workVolume,
        BigDecimal normHours,
        BigDecimal actualHours,
        BigDecimal rateAmount,
        BigDecimal costAmount
) {}

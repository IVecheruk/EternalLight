package com.eternallight.backend.api.dto.request;

import java.math.BigDecimal;

public record UpdateWorkActLaborItemRequest(
        Integer seq,
        String workTypeName,
        Long uomId,
        BigDecimal workVolume,
        BigDecimal normHours,
        BigDecimal actualHours,
        BigDecimal rateAmount,
        BigDecimal costAmount
) {}

package com.eternallight.backend.api.dto.request;

import java.math.BigDecimal;

public record UpdateWorkActMaterialRequest(
        Integer seq,
        String name,
        String modelOrArticle,
        Long uomId,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}

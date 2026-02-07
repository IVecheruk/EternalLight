package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;

public record WorkActMaterialResponse(
        Long id,
        Long workActId,
        Integer seq,
        String name,
        String modelOrArticle,
        Long uomId,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}

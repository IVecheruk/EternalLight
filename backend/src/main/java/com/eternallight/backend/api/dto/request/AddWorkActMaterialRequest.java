package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record AddWorkActMaterialRequest(
        Integer seq,
        @NotBlank String name,
        String modelOrArticle,
        Long uomId,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}

package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record UpsertWorkActDismantledEquipmentRequest(
        Integer seq,
        @NotBlank String name,
        String model,
        String serialNumber,
        Integer manufactureYear,
        @PositiveOrZero BigDecimal quantity,
        Long equipmentConditionId,
        String storageOrTransferPlace
) {}

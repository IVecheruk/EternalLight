package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;

public record WorkActDismantledEquipmentResponse(
        Long id,
        Long workActId,
        Integer seq,
        String name,
        String model,
        String serialNumber,
        Integer manufactureYear,
        BigDecimal quantity,
        Long equipmentConditionId,
        String storageOrTransferPlace
) {}

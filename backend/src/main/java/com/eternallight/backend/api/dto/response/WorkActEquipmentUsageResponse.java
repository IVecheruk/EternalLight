package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;

public record WorkActEquipmentUsageResponse(
        Long id,
        Long workActId,
        Integer seq,
        String equipmentName,
        String registrationOrInventoryNumber,
        BigDecimal usedHours,
        BigDecimal machineHourCost,
        BigDecimal lineTotal
) {}

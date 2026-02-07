package com.eternallight.backend.api.dto.request;

import java.math.BigDecimal;

public record UpdateWorkActEquipmentUsageRequest(
        Integer seq,
        String equipmentName,
        String registrationOrInventoryNumber,
        BigDecimal usedHours,
        BigDecimal machineHourCost,
        BigDecimal lineTotal
) {}

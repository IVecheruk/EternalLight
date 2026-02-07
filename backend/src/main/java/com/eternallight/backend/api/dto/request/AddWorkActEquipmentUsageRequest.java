package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record AddWorkActEquipmentUsageRequest(
        Integer seq,
        @NotBlank String equipmentName,
        String registrationOrInventoryNumber,
        BigDecimal usedHours,
        BigDecimal machineHourCost,
        BigDecimal lineTotal
) {}

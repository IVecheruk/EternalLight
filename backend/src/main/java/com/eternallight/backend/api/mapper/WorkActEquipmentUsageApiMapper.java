package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActEquipmentUsageResponse;
import com.eternallight.backend.domain.model.WorkActEquipmentUsage;

public class WorkActEquipmentUsageApiMapper {
    private WorkActEquipmentUsageApiMapper() {}

    public static WorkActEquipmentUsageResponse toResponse(WorkActEquipmentUsage u) {
        return new WorkActEquipmentUsageResponse(
                u.getId(),
                u.getWorkActId(),
                u.getSeq(),
                u.getEquipmentName(),
                u.getRegistrationOrInventoryNumber(),
                u.getUsedHours(),
                u.getMachineHourCost(),
                u.getLineTotal()
        );
    }
}

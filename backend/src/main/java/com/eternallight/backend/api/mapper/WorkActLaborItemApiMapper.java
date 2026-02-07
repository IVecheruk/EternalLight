package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActLaborItemResponse;
import com.eternallight.backend.domain.model.WorkActLaborItem;

public class WorkActLaborItemApiMapper {
    private WorkActLaborItemApiMapper() {}

    public static WorkActLaborItemResponse toResponse(WorkActLaborItem i) {
        return new WorkActLaborItemResponse(
                i.getId(),
                i.getWorkActId(),
                i.getSeq(),
                i.getWorkTypeName(),
                i.getUomId(),
                i.getWorkVolume(),
                i.getNormHours(),
                i.getActualHours(),
                i.getRateAmount(),
                i.getCostAmount()
        );
    }
}

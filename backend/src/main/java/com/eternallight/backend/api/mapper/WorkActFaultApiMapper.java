package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActFaultResponse;
import com.eternallight.backend.domain.model.WorkActFault;

public class WorkActFaultApiMapper {
    private WorkActFaultApiMapper() {}

    public static WorkActFaultResponse toResponse(WorkActFault f) {
        return new WorkActFaultResponse(
                f.getId(),
                f.getWorkActId(),
                f.getFaultTypeId(),
                f.getIsSelected(),
                f.getOtherText()
        );
    }
}

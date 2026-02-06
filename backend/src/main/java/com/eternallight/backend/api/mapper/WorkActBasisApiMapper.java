package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActBasisResponse;
import com.eternallight.backend.domain.model.WorkActBasis;

public class WorkActBasisApiMapper {
    private WorkActBasisApiMapper() {}

    public static WorkActBasisResponse toResponse(WorkActBasis b) {
        return new WorkActBasisResponse(
                b.getId(),
                b.getWorkActId(),
                b.getWorkBasisTypeId(),
                b.getIsSelected(),
                b.getDocumentNumber(),
                b.getDocumentDate()
        );
    }
}

package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkBasisTypeResponse;
import com.eternallight.backend.domain.model.WorkBasisType;

public class WorkBasisTypeApiMapper {
    private WorkBasisTypeApiMapper() {}

    public static WorkBasisTypeResponse toResponse(WorkBasisType t) {
        return new WorkBasisTypeResponse(t.getId(), t.getCode(), t.getName());
    }
}

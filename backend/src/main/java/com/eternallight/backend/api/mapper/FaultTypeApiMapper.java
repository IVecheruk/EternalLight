package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.FaultTypeResponse;
import com.eternallight.backend.domain.model.FaultType;

public class FaultTypeApiMapper {
    private FaultTypeApiMapper() {}

    public static FaultTypeResponse toResponse(FaultType t) {
        return new FaultTypeResponse(t.getId(), t.getCode(), t.getName(), t.getIsOther());
    }
}

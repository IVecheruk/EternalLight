package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.UnitOfMeasureResponse;
import com.eternallight.backend.domain.model.UnitOfMeasure;

public class UnitOfMeasureApiMapper {
    private UnitOfMeasureApiMapper() {}

    public static UnitOfMeasureResponse toResponse(UnitOfMeasure u) {
        return new UnitOfMeasureResponse(u.getId(), u.getName());
    }
}

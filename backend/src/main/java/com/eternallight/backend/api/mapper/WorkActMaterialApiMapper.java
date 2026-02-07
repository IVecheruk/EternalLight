package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActMaterialResponse;
import com.eternallight.backend.domain.model.WorkActMaterial;

public class WorkActMaterialApiMapper {
    private WorkActMaterialApiMapper() {}

    public static WorkActMaterialResponse toResponse(WorkActMaterial m) {
        return new WorkActMaterialResponse(
                m.getId(),
                m.getWorkActId(),
                m.getSeq(),
                m.getName(),
                m.getModelOrArticle(),
                m.getUomId(),
                m.getQuantity(),
                m.getUnitPrice(),
                m.getLineTotal()
        );
    }
}

package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActPerformedWorkResponse;
import com.eternallight.backend.domain.model.WorkActPerformedWork;

public class WorkActPerformedWorkApiMapper {
    private WorkActPerformedWorkApiMapper() {}

    public static WorkActPerformedWorkResponse toResponse(WorkActPerformedWork w) {
        return new WorkActPerformedWorkResponse(
                w.getId(),
                w.getWorkActId(),
                w.getSeq(),
                w.getDescription()
        );
    }
}

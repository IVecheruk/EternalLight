package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActApprovalResponse;
import com.eternallight.backend.domain.model.WorkActApproval;

public class WorkActApprovalApiMapper {
    private WorkActApprovalApiMapper() {}

    public static WorkActApprovalResponse toResponse(WorkActApproval a) {
        return new WorkActApprovalResponse(
                a.getWorkActId(),
                a.getApproverPosition(),
                a.getApproverFullName(),
                a.getApprovalDate(),
                a.getStampPresent()
        );
    }
}

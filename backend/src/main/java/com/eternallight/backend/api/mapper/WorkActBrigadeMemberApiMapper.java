package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActBrigadeMemberResponse;
import com.eternallight.backend.domain.model.WorkActBrigadeMember;

public class WorkActBrigadeMemberApiMapper {
    private WorkActBrigadeMemberApiMapper() {}

    public static WorkActBrigadeMemberResponse toResponse(WorkActBrigadeMember m) {
        return new WorkActBrigadeMemberResponse(
                m.getId(),
                m.getWorkActId(),
                m.getEmployeeId(),
                m.getBrigadeRoleId(),
                m.getSeq()
        );
    }
}

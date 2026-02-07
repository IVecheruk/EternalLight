package com.eternallight.backend.api.dto.response;

public record WorkActBrigadeMemberResponse(
        Long id,
        Long workActId,
        Long employeeId,
        Long brigadeRoleId,
        Integer seq
) {}

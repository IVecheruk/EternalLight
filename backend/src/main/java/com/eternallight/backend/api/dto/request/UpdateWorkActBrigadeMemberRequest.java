package com.eternallight.backend.api.dto.request;

public record UpdateWorkActBrigadeMemberRequest(
        Long brigadeRoleId,
        Integer seq
) {}

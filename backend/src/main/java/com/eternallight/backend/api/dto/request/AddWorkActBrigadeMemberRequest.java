package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddWorkActBrigadeMemberRequest(
        @NotNull @Positive Long employeeId,
        @NotNull @Positive Long brigadeRoleId,
        Integer seq
) {}

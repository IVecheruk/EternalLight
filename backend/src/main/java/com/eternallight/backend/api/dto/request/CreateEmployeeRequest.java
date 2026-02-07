package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateEmployeeRequest(
        @NotBlank String fullName,
        String position,
        String employeeNumber,
        String electricalSafetyGroup,
        @Positive Long organizationId
) {}

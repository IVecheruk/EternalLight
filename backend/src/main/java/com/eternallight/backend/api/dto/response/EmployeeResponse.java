package com.eternallight.backend.api.dto.response;

public record EmployeeResponse(
        Long id,
        String fullName,
        String position,
        String employeeNumber,
        String electricalSafetyGroup,
        Long organizationId
) {}

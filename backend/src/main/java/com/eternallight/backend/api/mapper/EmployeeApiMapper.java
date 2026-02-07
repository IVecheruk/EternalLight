package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.EmployeeResponse;
import com.eternallight.backend.domain.model.Employee;

public class EmployeeApiMapper {
    private EmployeeApiMapper() {}

    public static EmployeeResponse toResponse(Employee e) {
        return new EmployeeResponse(
                e.getId(),
                e.getFullName(),
                e.getPosition(),
                e.getEmployeeNumber(),
                e.getElectricalSafetyGroup(),
                e.getOrganizationId()
        );
    }
}

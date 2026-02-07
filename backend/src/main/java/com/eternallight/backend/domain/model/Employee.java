package com.eternallight.backend.domain.model;

public class Employee {
    private final Long id;
    private final String fullName;
    private final String position;
    private final String employeeNumber;
    private final String electricalSafetyGroup;
    private final Long organizationId;

    public Employee(Long id, String fullName, String position, String employeeNumber, String electricalSafetyGroup, Long organizationId) {
        this.id = id;
        this.fullName = fullName;
        this.position = position;
        this.employeeNumber = employeeNumber;
        this.electricalSafetyGroup = electricalSafetyGroup;
        this.organizationId = organizationId;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getPosition() { return position; }
    public String getEmployeeNumber() { return employeeNumber; }
    public String getElectricalSafetyGroup() { return electricalSafetyGroup; }
    public Long getOrganizationId() { return organizationId; }
}

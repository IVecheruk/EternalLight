package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "position")
    private String position;

    @Column(name = "employee_number", unique = true)
    private String employeeNumber;

    @Column(name = "electrical_safety_group")
    private String electricalSafetyGroup;

    @Column(name = "organization_id")
    private Long organizationId;

    public EmployeeEntity(
            String fullName,
            String position,
            String employeeNumber,
            String electricalSafetyGroup,
            Long organizationId
    ) {
        this.fullName = fullName;
        this.position = position;
        this.employeeNumber = employeeNumber;
        this.electricalSafetyGroup = electricalSafetyGroup;
        this.organizationId = organizationId;
    }
}

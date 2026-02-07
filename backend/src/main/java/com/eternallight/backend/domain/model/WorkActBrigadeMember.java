package com.eternallight.backend.domain.model;

public class WorkActBrigadeMember {
    private final Long id;
    private final Long workActId;
    private final Long employeeId;
    private final Long brigadeRoleId;
    private final Integer seq;

    public WorkActBrigadeMember(Long id, Long workActId, Long employeeId, Long brigadeRoleId, Integer seq) {
        this.id = id;
        this.workActId = workActId;
        this.employeeId = employeeId;
        this.brigadeRoleId = brigadeRoleId;
        this.seq = seq;
    }

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Long getEmployeeId() { return employeeId; }
    public Long getBrigadeRoleId() { return brigadeRoleId; }
    public Integer getSeq() { return seq; }
}

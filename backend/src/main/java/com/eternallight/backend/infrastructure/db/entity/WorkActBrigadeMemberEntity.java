package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "work_act_brigade_member")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActBrigadeMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_act_brigade_member_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "brigade_role_id", nullable = false)
    private Long brigadeRoleId;

    @Column(name = "seq")
    private Integer seq;

    public WorkActBrigadeMemberEntity(Long workActId, Long employeeId, Long brigadeRoleId, Integer seq) {
        this.workActId = workActId;
        this.employeeId = employeeId;
        this.brigadeRoleId = brigadeRoleId;
        this.seq = seq;
    }
}

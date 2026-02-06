package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "work_act_approval")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActApprovalEntity {

    @Id
    @Column(name = "work_act_id")
    private Long workActId;

    @Column(name = "approver_position")
    private String approverPosition;

    @Column(name = "approver_full_name")
    private String approverFullName;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "stamp_present")
    private Boolean stampPresent;

    public WorkActApprovalEntity(
            Long workActId,
            String approverPosition,
            String approverFullName,
            LocalDate approvalDate,
            Boolean stampPresent
    ) {
        this.workActId = workActId;
        this.approverPosition = approverPosition;
        this.approverFullName = approverFullName;
        this.approvalDate = approvalDate;
        this.stampPresent = stampPresent;
    }
}

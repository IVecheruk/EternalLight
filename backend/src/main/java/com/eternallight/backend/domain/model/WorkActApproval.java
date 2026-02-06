package com.eternallight.backend.domain.model;

import java.time.LocalDate;

public class WorkActApproval {

    private final Long workActId;
    private final String approverPosition;
    private final String approverFullName;
    private final LocalDate approvalDate;
    private final Boolean stampPresent;

    public WorkActApproval(
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

    public Long getWorkActId() { return workActId; }
    public String getApproverPosition() { return approverPosition; }
    public String getApproverFullName() { return approverFullName; }
    public LocalDate getApprovalDate() { return approvalDate; }
    public Boolean getStampPresent() { return stampPresent; }
}

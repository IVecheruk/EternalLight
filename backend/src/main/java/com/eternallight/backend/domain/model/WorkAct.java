package com.eternallight.backend.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class WorkAct {

    private final Long id;
    private final String actNumber;
    private final LocalDate actCompiledOn;
    private final String actPlace;
    private final Long executorOrgId;
    private final String structuralUnit;
    private final Long lightingObjectId;
    private final OffsetDateTime workStartedAt;
    private final OffsetDateTime workFinishedAt;
    private final Integer totalDurationMinutes;
    private final Integer actualWorkMinutes;
    private final Integer downtimeMinutes;
    private final String downtimeReason;
    private final String faultDetails;
    private final String faultCause;
    private final String qualityRemarks;
    private final BigDecimal otherExpensesAmount;
    private final BigDecimal materialsTotalAmount;
    private final BigDecimal worksTotalAmount;
    private final BigDecimal transportTotalAmount;
    private final BigDecimal grandTotalAmount;
    private final String grandTotalInWords;
    private final Integer warrantyWorkMonths;
    private final LocalDate warrantyWorkStart;
    private final LocalDate warrantyWorkEnd;
    private final Integer warrantyEquipmentMonths;
    private final String warrantyTerms;
    private final Integer copiesCount;
    private final Boolean acceptedWithoutRemarks;

    public WorkAct(
            Long id,
            String actNumber,
            LocalDate actCompiledOn,
            String actPlace,
            Long executorOrgId,
            String structuralUnit,
            Long lightingObjectId,
            OffsetDateTime workStartedAt,
            OffsetDateTime workFinishedAt,
            Integer totalDurationMinutes,
            Integer actualWorkMinutes,
            Integer downtimeMinutes,
            String downtimeReason,
            String faultDetails,
            String faultCause,
            String qualityRemarks,
            BigDecimal otherExpensesAmount,
            BigDecimal materialsTotalAmount,
            BigDecimal worksTotalAmount,
            BigDecimal transportTotalAmount,
            BigDecimal grandTotalAmount,
            String grandTotalInWords,
            Integer warrantyWorkMonths,
            LocalDate warrantyWorkStart,
            LocalDate warrantyWorkEnd,
            Integer warrantyEquipmentMonths,
            String warrantyTerms,
            Integer copiesCount,
            Boolean acceptedWithoutRemarks
    ) {
        this.id = id;
        this.actNumber = actNumber;
        this.actCompiledOn = actCompiledOn;
        this.actPlace = actPlace;
        this.executorOrgId = executorOrgId;
        this.structuralUnit = structuralUnit;
        this.lightingObjectId = lightingObjectId;
        this.workStartedAt = workStartedAt;
        this.workFinishedAt = workFinishedAt;
        this.totalDurationMinutes = totalDurationMinutes;
        this.actualWorkMinutes = actualWorkMinutes;
        this.downtimeMinutes = downtimeMinutes;
        this.downtimeReason = downtimeReason;
        this.faultDetails = faultDetails;
        this.faultCause = faultCause;
        this.qualityRemarks = qualityRemarks;
        this.otherExpensesAmount = otherExpensesAmount;
        this.materialsTotalAmount = materialsTotalAmount;
        this.worksTotalAmount = worksTotalAmount;
        this.transportTotalAmount = transportTotalAmount;
        this.grandTotalAmount = grandTotalAmount;
        this.grandTotalInWords = grandTotalInWords;
        this.warrantyWorkMonths = warrantyWorkMonths;
        this.warrantyWorkStart = warrantyWorkStart;
        this.warrantyWorkEnd = warrantyWorkEnd;
        this.warrantyEquipmentMonths = warrantyEquipmentMonths;
        this.warrantyTerms = warrantyTerms;
        this.copiesCount = copiesCount;
        this.acceptedWithoutRemarks = acceptedWithoutRemarks;
    }

    public Long getId() { return id; }
    public String getActNumber() { return actNumber; }
    public LocalDate getActCompiledOn() { return actCompiledOn; }
    public String getActPlace() { return actPlace; }
    public Long getExecutorOrgId() { return executorOrgId; }
    public String getStructuralUnit() { return structuralUnit; }
    public Long getLightingObjectId() { return lightingObjectId; }
    public OffsetDateTime getWorkStartedAt() { return workStartedAt; }
    public OffsetDateTime getWorkFinishedAt() { return workFinishedAt; }
    public Integer getTotalDurationMinutes() { return totalDurationMinutes; }
    public Integer getActualWorkMinutes() { return actualWorkMinutes; }
    public Integer getDowntimeMinutes() { return downtimeMinutes; }
    public String getDowntimeReason() { return downtimeReason; }
    public String getFaultDetails() { return faultDetails; }
    public String getFaultCause() { return faultCause; }
    public String getQualityRemarks() { return qualityRemarks; }
    public BigDecimal getOtherExpensesAmount() { return otherExpensesAmount; }
    public BigDecimal getMaterialsTotalAmount() { return materialsTotalAmount; }
    public BigDecimal getWorksTotalAmount() { return worksTotalAmount; }
    public BigDecimal getTransportTotalAmount() { return transportTotalAmount; }
    public BigDecimal getGrandTotalAmount() { return grandTotalAmount; }
    public String getGrandTotalInWords() { return grandTotalInWords; }
    public Integer getWarrantyWorkMonths() { return warrantyWorkMonths; }
    public LocalDate getWarrantyWorkStart() { return warrantyWorkStart; }
    public LocalDate getWarrantyWorkEnd() { return warrantyWorkEnd; }
    public Integer getWarrantyEquipmentMonths() { return warrantyEquipmentMonths; }
    public String getWarrantyTerms() { return warrantyTerms; }
    public Integer getCopiesCount() { return copiesCount; }
    public Boolean getAcceptedWithoutRemarks() { return acceptedWithoutRemarks; }
}

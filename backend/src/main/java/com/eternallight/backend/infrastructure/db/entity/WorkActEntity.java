package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "work_act")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_act_id")
    private Long id;

    @Column(name = "act_number")
    private String actNumber;

    @Column(name = "act_compiled_on")
    private LocalDate actCompiledOn;

    @Column(name = "act_place")
    private String actPlace;

    @Column(name = "executor_org_id", nullable = false)
    private Long executorOrgId;

    @Column(name = "structural_unit")
    private String structuralUnit;

    @Column(name = "lighting_object_id")
    private Long lightingObjectId;

    @Column(name = "work_started_at")
    private OffsetDateTime workStartedAt;

    @Column(name = "work_finished_at")
    private OffsetDateTime workFinishedAt;

    @Column(name = "total_duration_minutes")
    private Integer totalDurationMinutes;

    @Column(name = "actual_work_minutes")
    private Integer actualWorkMinutes;

    @Column(name = "downtime_minutes")
    private Integer downtimeMinutes;

    @Column(name = "downtime_reason")
    private String downtimeReason;

    @Column(name = "fault_details")
    private String faultDetails;

    @Column(name = "fault_cause")
    private String faultCause;

    @Column(name = "quality_remarks")
    private String qualityRemarks;

    @Column(name = "other_expenses_amount", precision = 14, scale = 2)
    private BigDecimal otherExpensesAmount;

    @Column(name = "materials_total_amount", precision = 14, scale = 2)
    private BigDecimal materialsTotalAmount;

    @Column(name = "works_total_amount", precision = 14, scale = 2)
    private BigDecimal worksTotalAmount;

    @Column(name = "transport_total_amount", precision = 14, scale = 2)
    private BigDecimal transportTotalAmount;

    @Column(name = "grand_total_amount", precision = 14, scale = 2)
    private BigDecimal grandTotalAmount;

    @Column(name = "grand_total_in_words")
    private String grandTotalInWords;

    @Column(name = "warranty_work_months")
    private Integer warrantyWorkMonths;

    @Column(name = "warranty_work_start")
    private LocalDate warrantyWorkStart;

    @Column(name = "warranty_work_end")
    private LocalDate warrantyWorkEnd;

    @Column(name = "warranty_equipment_months")
    private Integer warrantyEquipmentMonths;

    @Column(name = "warranty_terms")
    private String warrantyTerms;

    @Column(name = "copies_count")
    private Integer copiesCount;

    @Column(name = "accepted_without_remarks")
    private Boolean acceptedWithoutRemarks;

    public WorkActEntity(
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
}

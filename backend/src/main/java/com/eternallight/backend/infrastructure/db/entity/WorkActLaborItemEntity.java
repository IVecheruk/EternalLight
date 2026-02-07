package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "work_act_labor_item")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActLaborItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "labor_item_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "seq")
    private Integer seq;

    @Column(name = "work_type_name", nullable = false)
    private String workTypeName;

    @Column(name = "uom_id")
    private Long uomId;

    @Column(name = "work_volume", precision = 14, scale = 3)
    private BigDecimal workVolume;

    @Column(name = "norm_hours", precision = 10, scale = 2)
    private BigDecimal normHours;

    @Column(name = "actual_hours", precision = 10, scale = 2)
    private BigDecimal actualHours;

    @Column(name = "rate_amount", precision = 14, scale = 2)
    private BigDecimal rateAmount;

    @Column(name = "cost_amount", precision = 14, scale = 2)
    private BigDecimal costAmount;

    public WorkActLaborItemEntity(Long workActId, Integer seq, String workTypeName, Long uomId, BigDecimal workVolume,
                                  BigDecimal normHours, BigDecimal actualHours, BigDecimal rateAmount, BigDecimal costAmount) {
        this.workActId = workActId;
        this.seq = seq;
        this.workTypeName = workTypeName;
        this.uomId = uomId;
        this.workVolume = workVolume;
        this.normHours = normHours;
        this.actualHours = actualHours;
        this.rateAmount = rateAmount;
        this.costAmount = costAmount;
    }
}

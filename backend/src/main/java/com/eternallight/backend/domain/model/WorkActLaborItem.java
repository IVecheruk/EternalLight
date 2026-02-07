package com.eternallight.backend.domain.model;

import java.math.BigDecimal;

public class WorkActLaborItem {

    private final Long id;
    private final Long workActId;
    private final Integer seq;
    private final String workTypeName;
    private final Long uomId;
    private final BigDecimal workVolume;
    private final BigDecimal normHours;
    private final BigDecimal actualHours;
    private final BigDecimal rateAmount;
    private final BigDecimal costAmount;

    public WorkActLaborItem(Long id, Long workActId, Integer seq, String workTypeName, Long uomId,
                            BigDecimal workVolume, BigDecimal normHours, BigDecimal actualHours,
                            BigDecimal rateAmount, BigDecimal costAmount) {
        this.id = id;
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

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Integer getSeq() { return seq; }
    public String getWorkTypeName() { return workTypeName; }
    public Long getUomId() { return uomId; }
    public BigDecimal getWorkVolume() { return workVolume; }
    public BigDecimal getNormHours() { return normHours; }
    public BigDecimal getActualHours() { return actualHours; }
    public BigDecimal getRateAmount() { return rateAmount; }
    public BigDecimal getCostAmount() { return costAmount; }
}

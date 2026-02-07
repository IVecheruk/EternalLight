package com.eternallight.backend.domain.model;

import java.math.BigDecimal;

public class WorkActEquipmentUsage {

    private final Long id;
    private final Long workActId;
    private final Integer seq;
    private final String equipmentName;
    private final String registrationOrInventoryNumber;
    private final BigDecimal usedHours;
    private final BigDecimal machineHourCost;
    private final BigDecimal lineTotal;

    public WorkActEquipmentUsage(Long id, Long workActId, Integer seq, String equipmentName, String registrationOrInventoryNumber,
                                 BigDecimal usedHours, BigDecimal machineHourCost, BigDecimal lineTotal) {
        this.id = id;
        this.workActId = workActId;
        this.seq = seq;
        this.equipmentName = equipmentName;
        this.registrationOrInventoryNumber = registrationOrInventoryNumber;
        this.usedHours = usedHours;
        this.machineHourCost = machineHourCost;
        this.lineTotal = lineTotal;
    }

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Integer getSeq() { return seq; }
    public String getEquipmentName() { return equipmentName; }
    public String getRegistrationOrInventoryNumber() { return registrationOrInventoryNumber; }
    public BigDecimal getUsedHours() { return usedHours; }
    public BigDecimal getMachineHourCost() { return machineHourCost; }
    public BigDecimal getLineTotal() { return lineTotal; }
}

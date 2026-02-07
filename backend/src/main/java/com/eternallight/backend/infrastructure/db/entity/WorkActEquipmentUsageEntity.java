package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "work_act_equipment_usage")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActEquipmentUsageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_usage_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "seq")
    private Integer seq;

    @Column(name = "equipment_name", nullable = false)
    private String equipmentName;

    @Column(name = "registration_or_inventory_number")
    private String registrationOrInventoryNumber;

    @Column(name = "used_hours", precision = 10, scale = 2)
    private BigDecimal usedHours;

    @Column(name = "machine_hour_cost", precision = 14, scale = 2)
    private BigDecimal machineHourCost;

    @Column(name = "line_total", precision = 14, scale = 2)
    private BigDecimal lineTotal;

    public WorkActEquipmentUsageEntity(Long workActId, Integer seq, String equipmentName, String registrationOrInventoryNumber,
                                       BigDecimal usedHours, BigDecimal machineHourCost, BigDecimal lineTotal) {
        this.workActId = workActId;
        this.seq = seq;
        this.equipmentName = equipmentName;
        this.registrationOrInventoryNumber = registrationOrInventoryNumber;
        this.usedHours = usedHours;
        this.machineHourCost = machineHourCost;
        this.lineTotal = lineTotal;
    }
}

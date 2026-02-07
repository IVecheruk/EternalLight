package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "work_act_dismantled_equipment")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActDismantledEquipmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dismantled_equipment_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "seq")
    private Integer seq;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "model")
    private String model;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "quantity")
    private BigDecimal quantity;

    // ✅ ВАЖНО: имя колонки как в БД
    @Column(name = "equipment_condition_id")
    private Long equipmentConditionId;

    @Column(name = "storage_or_transfer_place")
    private String storageOrTransferPlace;
}

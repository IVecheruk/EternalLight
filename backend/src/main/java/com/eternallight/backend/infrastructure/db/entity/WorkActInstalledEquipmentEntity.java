package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "work_act_installed_equipment")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActInstalledEquipmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "installed_equipment_id")
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

    @Column(name = "quantity", precision = 14, scale = 3)
    private BigDecimal quantity;

    @Column(name = "installed_on")
    private LocalDate installedOn;

    @Column(name = "warranty_months")
    private Integer warrantyMonths;

    @Column(name = "warranty_until")
    private LocalDate warrantyUntil;

    @Column(name = "passport_or_certificate_number")
    private String passportOrCertificateNumber;
}

package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "lighting_object")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LightingObjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lighting_object_id")
    private Long id;

    @Column(name = "administrative_district_id")
    private Long administrativeDistrictId;

    @Column(name = "street_id")
    private Long streetId;

    @Column(name = "house_landmark")
    private String houseLandmark;

    @Column(name = "gps_latitude", precision = 9, scale = 6)
    private BigDecimal gpsLatitude;

    @Column(name = "gps_longitude", precision = 9, scale = 6)
    private BigDecimal gpsLongitude;

    @Column(name = "outdoor_line_number")
    private String outdoorLineNumber;

    @Column(name = "control_cabinet_number")
    private String controlCabinetNumber;

    @Column(name = "pole_number")
    private String poleNumber;

    @Column(name = "luminaire_number")
    private String luminaireNumber;

    @Column(name = "equipment_inventory_number")
    private String equipmentInventoryNumber;

    public LightingObjectEntity(
            Long administrativeDistrictId,
            Long streetId,
            String houseLandmark,
            BigDecimal gpsLatitude,
            BigDecimal gpsLongitude,
            String outdoorLineNumber,
            String controlCabinetNumber,
            String poleNumber,
            String luminaireNumber,
            String equipmentInventoryNumber
    ) {
        this.administrativeDistrictId = administrativeDistrictId;
        this.streetId = streetId;
        this.houseLandmark = houseLandmark;
        this.gpsLatitude = gpsLatitude;
        this.gpsLongitude = gpsLongitude;
        this.outdoorLineNumber = outdoorLineNumber;
        this.controlCabinetNumber = controlCabinetNumber;
        this.poleNumber = poleNumber;
        this.luminaireNumber = luminaireNumber;
        this.equipmentInventoryNumber = equipmentInventoryNumber;
    }
}

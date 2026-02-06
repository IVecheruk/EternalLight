package com.eternallight.backend.domain.model;

import java.math.BigDecimal;

public class LightingObject {
    private final Long id;
    private final Long administrativeDistrictId;
    private final Long streetId;
    private final String houseLandmark;
    private final BigDecimal gpsLatitude;
    private final BigDecimal gpsLongitude;
    private final String outdoorLineNumber;
    private final String controlCabinetNumber;
    private final String poleNumber;
    private final String luminaireNumber;
    private final String equipmentInventoryNumber;

    public LightingObject(
            Long id,
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
        this.id = id;
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

    public Long getId() { return id; }
    public Long getAdministrativeDistrictId() { return administrativeDistrictId; }
    public Long getStreetId() { return streetId; }
    public String getHouseLandmark() { return houseLandmark; }
    public BigDecimal getGpsLatitude() { return gpsLatitude; }
    public BigDecimal getGpsLongitude() { return gpsLongitude; }
    public String getOutdoorLineNumber() { return outdoorLineNumber; }
    public String getControlCabinetNumber() { return controlCabinetNumber; }
    public String getPoleNumber() { return poleNumber; }
    public String getLuminaireNumber() { return luminaireNumber; }
    public String getEquipmentInventoryNumber() { return equipmentInventoryNumber; }
}

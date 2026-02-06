package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;

public record LightingObjectResponse(
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
) {}

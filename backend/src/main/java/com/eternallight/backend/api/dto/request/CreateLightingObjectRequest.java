package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreateLightingObjectRequest(
        @Positive Long administrativeDistrictId,
        @Positive Long streetId,
        String houseLandmark,
        @Digits(integer = 3, fraction = 6) BigDecimal gpsLatitude,
        @Digits(integer = 3, fraction = 6) BigDecimal gpsLongitude,
        String outdoorLineNumber,
        String controlCabinetNumber,
        String poleNumber,
        String luminaireNumber,
        String equipmentInventoryNumber
) {}

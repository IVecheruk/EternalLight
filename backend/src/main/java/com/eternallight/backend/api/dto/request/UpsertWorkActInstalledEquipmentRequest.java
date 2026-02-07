package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpsertWorkActInstalledEquipmentRequest(
        Integer seq,
        @NotBlank String name,
        String model,
        String serialNumber,
        Integer manufactureYear,
        @PositiveOrZero BigDecimal quantity,
        LocalDate installedOn,
        Integer warrantyMonths,
        LocalDate warrantyUntil,
        String passportOrCertificateNumber
) {}

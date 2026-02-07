package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record WorkActInstalledEquipmentResponse(
        Long id,
        Long workActId,
        Integer seq,
        String name,
        String model,
        String serialNumber,
        Integer manufactureYear,
        BigDecimal quantity,
        LocalDate installedOn,
        Integer warrantyMonths,
        LocalDate warrantyUntil,
        String passportOrCertificateNumber
) {}

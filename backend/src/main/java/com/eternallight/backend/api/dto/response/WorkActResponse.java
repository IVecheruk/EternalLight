package com.eternallight.backend.api.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record WorkActResponse(
        Long id,
        String actNumber,
        LocalDate actCompiledOn,
        String actPlace,
        Long executorOrgId,
        String structuralUnit,
        Long lightingObjectId,
        OffsetDateTime workStartedAt,
        OffsetDateTime workFinishedAt,
        Integer totalDurationMinutes,
        Integer actualWorkMinutes,
        Integer downtimeMinutes,
        String downtimeReason,
        String faultDetails,
        String faultCause,
        String qualityRemarks,
        BigDecimal otherExpensesAmount,
        BigDecimal materialsTotalAmount,
        BigDecimal worksTotalAmount,
        BigDecimal transportTotalAmount,
        BigDecimal grandTotalAmount,
        String grandTotalInWords,
        Integer warrantyWorkMonths,
        LocalDate warrantyWorkStart,
        LocalDate warrantyWorkEnd,
        Integer warrantyEquipmentMonths,
        String warrantyTerms,
        Integer copiesCount,
        Boolean acceptedWithoutRemarks
) {}

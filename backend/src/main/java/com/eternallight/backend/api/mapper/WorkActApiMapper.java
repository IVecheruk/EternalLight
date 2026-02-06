package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.WorkActResponse;
import com.eternallight.backend.domain.model.WorkAct;

public class WorkActApiMapper {
    private WorkActApiMapper() {}

    public static WorkActResponse toResponse(WorkAct a) {
        return new WorkActResponse(
                a.getId(),
                a.getActNumber(),
                a.getActCompiledOn(),
                a.getActPlace(),
                a.getExecutorOrgId(),
                a.getStructuralUnit(),
                a.getLightingObjectId(),
                a.getWorkStartedAt(),
                a.getWorkFinishedAt(),
                a.getTotalDurationMinutes(),
                a.getActualWorkMinutes(),
                a.getDowntimeMinutes(),
                a.getDowntimeReason(),
                a.getFaultDetails(),
                a.getFaultCause(),
                a.getQualityRemarks(),
                a.getOtherExpensesAmount(),
                a.getMaterialsTotalAmount(),
                a.getWorksTotalAmount(),
                a.getTransportTotalAmount(),
                a.getGrandTotalAmount(),
                a.getGrandTotalInWords(),
                a.getWarrantyWorkMonths(),
                a.getWarrantyWorkStart(),
                a.getWarrantyWorkEnd(),
                a.getWarrantyEquipmentMonths(),
                a.getWarrantyTerms(),
                a.getCopiesCount(),
                a.getAcceptedWithoutRemarks()
        );
    }
}

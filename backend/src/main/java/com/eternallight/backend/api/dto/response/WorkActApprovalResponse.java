package com.eternallight.backend.api.dto.response;

import java.time.LocalDate;

public record WorkActApprovalResponse(
        Long workActId,
        String approverPosition,
        String approverFullName,
        LocalDate approvalDate,
        Boolean stampPresent
) {}

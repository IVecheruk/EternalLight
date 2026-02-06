package com.eternallight.backend.api.dto.request;

import java.time.LocalDate;

public record UpsertWorkActApprovalRequest(
        String approverPosition,
        String approverFullName,
        LocalDate approvalDate,
        Boolean stampPresent
) {}

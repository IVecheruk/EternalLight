package com.eternallight.backend.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateOrganizationRequest(
        @NotBlank String fullName,
        String city
) {}
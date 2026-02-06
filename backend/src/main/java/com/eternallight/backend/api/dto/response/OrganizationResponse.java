package com.eternallight.backend.api.dto.response;

public record OrganizationResponse(
        Long id,
        String fullName,
        String city
) {}
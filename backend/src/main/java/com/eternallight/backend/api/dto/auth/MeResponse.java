package com.eternallight.backend.api.dto.auth;

import java.time.LocalDate;
import java.util.List;

public record MeResponse(
        Long id,
        String email,
        List<String> roles,
        String fullName,
        String address,
        LocalDate birthDate,
        String phone,
        String notificationEmail
) {}

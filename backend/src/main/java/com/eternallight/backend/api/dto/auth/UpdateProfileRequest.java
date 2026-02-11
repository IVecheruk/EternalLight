package com.eternallight.backend.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateProfileRequest(
        @Size(max = 200) String fullName,
        @Size(max = 300) String address,
        LocalDate birthDate,
        @Size(max = 40) String phone,
        @Email @Size(max = 120) String notificationEmail
) {}

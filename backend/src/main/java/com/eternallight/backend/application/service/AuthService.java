package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.auth.LoginRequest;
import com.eternallight.backend.api.dto.auth.RegisterRequest;
import com.eternallight.backend.api.dto.auth.TokenResponse;
import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import com.eternallight.backend.infrastructure.security.JwtService;
import com.eternallight.backend.infrastructure.security.RoleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public TokenResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.email());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        String role = RoleUtils.USER;

        UserEntity user = UserEntity.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        return new TokenResponse(token, "Bearer");
    }

    public TokenResponse login(LoginRequest req) {
        String email = normalizeEmail(req.email());

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            String reason = user.getBlockedReason();
            if (reason != null && !reason.isBlank()) {
                throw new IllegalArgumentException("User is blocked: " + reason.trim());
            }
            throw new IllegalArgumentException("User is blocked");
        }

        String token = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        return new TokenResponse(token, "Bearer");
    }

    private String normalizeEmail(String email) {
        if (email == null) return "";
        return email.toLowerCase().trim();
    }

}

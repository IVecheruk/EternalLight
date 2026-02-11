package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.auth.LoginRequest;
import com.eternallight.backend.api.dto.auth.RegisterRequest;
import com.eternallight.backend.api.dto.auth.TokenResponse;
import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import com.eternallight.backend.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Set<String> ALLOWED_ROLES = Set.of(
            "SUPER_ADMIN",
            "ORG_ADMIN",
            "DISPATCHER",
            "TECHNICIAN"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public TokenResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.email());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        String role = resolveRole(req.role());

        UserEntity user = UserEntity.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(role)
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

        String token = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
        return new TokenResponse(token, "Bearer");
    }

    private String normalizeEmail(String email) {
        if (email == null) return "";
        return email.toLowerCase().trim();
    }

    private String resolveRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return "TECHNICIAN";
        }

        String role = rawRole.trim().toUpperCase();
        if (!ALLOWED_ROLES.contains(role)) {
            throw new IllegalArgumentException("Unsupported role. Allowed roles: " + ALLOWED_ROLES);
        }

        return role;
    }
}

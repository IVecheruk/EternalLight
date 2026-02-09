package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.auth.MeResponse;
import com.eternallight.backend.api.dto.auth.TokenResponse;
import com.eternallight.backend.infrastructure.db.entity.RefreshTokenEntity;
import com.eternallight.backend.infrastructure.db.repository.AppRoleRepository;
import com.eternallight.backend.infrastructure.db.repository.AppUserRepository;
import com.eternallight.backend.infrastructure.db.repository.RefreshTokenRepository;
import com.eternallight.backend.infrastructure.security.JwtProperties;
import com.eternallight.backend.infrastructure.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final AppUserRepository userRepo;
    private final AppRoleRepository roleRepo;
    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProps;

    public AuthService(
            AppUserRepository userRepo,
            AppRoleRepository roleRepo,
            RefreshTokenRepository refreshRepo,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProps
    ) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.refreshRepo = refreshRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProps = jwtProps;
    }

    @Transactional
    public TokenResponse login(String email, String password) {
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new IllegalArgumentException("User is disabled");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        var access = jwtService.generateAccessToken(user);
        var refresh = issueRefreshToken(user.getId());

        return new TokenResponse(access, refresh);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        var token = refreshRepo.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (token.getRevokedAt() != null) {
            throw new IllegalArgumentException("Refresh token revoked");
        }

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired");
        }

        var user = token.getUser();
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new IllegalArgumentException("User is disabled");
        }

        // rotation: старый refresh делаем revoked, выдаём новый
        token.setRevokedAt(OffsetDateTime.now());
        refreshRepo.save(token);

        var access = jwtService.generateAccessToken(user);
        var refresh = issueRefreshToken(user.getId());

        return new TokenResponse(access, refresh);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshRepo.findByToken(refreshToken).ifPresent(t -> {
            if (t.getRevokedAt() == null) {
                t.setRevokedAt(OffsetDateTime.now());
                refreshRepo.save(t);
            }
        });
    }

    @Transactional(readOnly = true)
    public MeResponse me(String email) {
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var roles = user.getRoles().stream().map(r -> r.getCode()).toList();
        return new MeResponse(user.getId(), user.getEmail(), roles);
    }

    private String issueRefreshToken(Long userId) {
        var user = userRepo.findById(userId).orElseThrow();

        var tokenValue = UUID.randomUUID().toString() + "." + UUID.randomUUID();
        var expiresAt = OffsetDateTime.now().plusDays(jwtProps.refreshTtlDays());

        var entity = RefreshTokenEntity.builder()
                .user(user)
                .token(tokenValue)
                .expiresAt(expiresAt)
                .revokedAt(null)
                .createdAt(OffsetDateTime.now())
                .build();

        refreshRepo.save(entity);
        return tokenValue;
    }
}

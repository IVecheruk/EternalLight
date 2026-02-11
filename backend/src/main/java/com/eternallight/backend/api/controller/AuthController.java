package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.auth.LoginRequest;
import com.eternallight.backend.api.dto.auth.MeResponse;
import com.eternallight.backend.api.dto.auth.RegisterRequest;
import com.eternallight.backend.api.dto.auth.TokenResponse;
import com.eternallight.backend.api.dto.auth.UpdateProfileRequest;
import com.eternallight.backend.application.service.AuthService;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        UserEntity user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return toMeResponse(user);
    }

    @PutMapping("/me")
    public MeResponse updateMe(@Valid @RequestBody UpdateProfileRequest req, Authentication auth) {
        UserEntity user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.setFullName(req.fullName());
        user.setAddress(req.address());
        user.setBirthDate(req.birthDate());
        user.setPhone(req.phone());
        String notificationEmail = req.notificationEmail();
        if (notificationEmail != null && notificationEmail.isBlank()) {
            notificationEmail = null;
        }
        user.setNotificationEmail(notificationEmail);

        UserEntity saved = userRepository.save(user);
        return toMeResponse(saved);
    }

    private MeResponse toMeResponse(UserEntity user) {
        return new MeResponse(
                user.getId(),
                user.getEmail(),
                List.of(user.getRole()),
                user.getFullName(),
                user.getAddress(),
                user.getBirthDate(),
                user.getPhone(),
                user.getNotificationEmail()
        );
    }
}

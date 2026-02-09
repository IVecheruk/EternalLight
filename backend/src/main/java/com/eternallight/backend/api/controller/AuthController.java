package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.auth.LoginRequest;
import com.eternallight.backend.api.dto.auth.RegisterRequest;
import com.eternallight.backend.api.dto.auth.TokenResponse;
import com.eternallight.backend.application.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        return ResponseEntity.ok(new MeResponse(auth.getName(), auth.getAuthorities().toString()));
    }

    public record MeResponse(String name, String authorities) {}
}

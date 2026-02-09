package com.eternallight.backend.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secretBase64;

    @Value("${security.jwt.access-ttl-seconds:3600}")
    private long accessTokenTtlSeconds;

    private SecretKey secretKey;

    @PostConstruct
    void init() {
        this.secretKey = Keys.hmacShaKeyFor(
                java.util.Base64.getDecoder().decode(secretBase64)
        );
    }

    /* ======================
       GENERATE TOKEN
       ====================== */

    public String generateAccessToken(Long userId, String email, String role) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTokenTtlSeconds)))
                .signWith(secretKey)
                .compact();
    }

    /* ======================
       PARSE / VALIDATE
       ====================== */

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long parseUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    public String parseEmail(String token) {
        return parseClaims(token).get("email", String.class);
    }

    public String parseRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

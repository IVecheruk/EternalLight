package com.eternallight.backend.infrastructure.security;

import com.eternallight.backend.infrastructure.db.entity.AppUserEntity;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final JwtProperties props;
    private final SecretKey key;

    public JwtService(JwtProperties props) {
        this.props = props;
        this.key = Keys.hmacShaKeyFor(props.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(AppUserEntity user) {
        var now = OffsetDateTime.now();
        var exp = now.plusMinutes(props.accessTtlMin());

        List<String> roles = user.getRoles().stream().map(r -> r.getCode()).toList();

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .issuedAt(Date.from(now.toInstant()))
                .expiration(Date.from(exp.toInstant()))
                .signWith(key)
                .compact();
    }

    public String parseUserId(String token) {
        var claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }
}

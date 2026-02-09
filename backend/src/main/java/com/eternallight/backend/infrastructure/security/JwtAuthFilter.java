package com.eternallight.backend.infrastructure.security;

import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Если уже аутентифицирован — пропускаем
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring("Bearer ".length()).trim();

        // Валидируем JWT
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        Long userId = jwtService.parseUserId(token);

        // Можно строить auth только из токена,
        // но лучше проверить что пользователь существует
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String role = user.getRole(); // или jwtService.parseRole(token)

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

        var auth = new UsernamePasswordAuthenticationToken(
                user,       // principal
                null,       // credentials
                authorities // roles
        );

        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}

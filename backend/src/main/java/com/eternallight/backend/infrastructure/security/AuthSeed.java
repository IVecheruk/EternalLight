package com.eternallight.backend.infrastructure.security;

import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthSeed implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        // admin@eternallight.local / admin
        String email = "admin@eternallight.local";

        if (userRepository.existsByEmail(email)) {
            return;
        }

        UserEntity admin = UserEntity.builder()
                .email(email.toLowerCase().trim())
                .passwordHash(encoder.encode("admin"))
                .role("ADMIN")
                .build();

        userRepository.save(admin);
    }
}

package com.eternallight.backend.infrastructure.security;

import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import com.eternallight.backend.infrastructure.security.RoleUtils;
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
        // superadmin@eternallight.local / superadmin
        String superEmail = "superadmin@eternallight.local";
        if (!userRepository.existsByEmail(superEmail)) {
            UserEntity superAdmin = UserEntity.builder()
                    .email(superEmail.toLowerCase().trim())
                    .passwordHash(encoder.encode("superadmin"))
                    .role(RoleUtils.SUPER_ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(superAdmin);
        }

        // admin@eternallight.local / admin
        String email = "admin@eternallight.local";
        if (!userRepository.existsByEmail(email)) {
            UserEntity admin = UserEntity.builder()
                    .email(email.toLowerCase().trim())
                    .passwordHash(encoder.encode("admin"))
                    .role(RoleUtils.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
        }
    }
}

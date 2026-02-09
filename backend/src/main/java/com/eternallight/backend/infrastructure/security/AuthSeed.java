package com.eternallight.backend.infrastructure.security;

import com.eternallight.backend.infrastructure.db.entity.AppUserEntity;
import com.eternallight.backend.infrastructure.db.repository.AppRoleRepository;
import com.eternallight.backend.infrastructure.db.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Set;

@Component
public class AuthSeed implements CommandLineRunner {

    private final AppUserRepository userRepo;
    private final AppRoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public AuthSeed(AppUserRepository userRepo, AppRoleRepository roleRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        // admin@eternallight.local / admin
        var email = "admin@eternallight.local";

        if (userRepo.findByEmail(email).isPresent()) return;

        var adminRole = roleRepo.findByCode("ADMIN").orElseThrow();

        var user = AppUserEntity.builder()
                .email(email)
                .passwordHash(encoder.encode("admin"))
                .isActive(true)
                .createdAt(OffsetDateTime.now())
                .roles(Set.of(adminRole))
                .build();

        userRepo.save(user);
    }
}

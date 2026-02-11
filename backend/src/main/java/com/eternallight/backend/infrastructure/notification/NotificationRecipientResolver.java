package com.eternallight.backend.infrastructure.notification;

import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NotificationRecipientResolver {

    private final UserRepository userRepository;

    public Optional<String> resolveRecipientEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return Optional.empty();
        }

        String name = auth.getName();
        if (name == null || name.isBlank() || "anonymousUser".equalsIgnoreCase(name)) {
            return Optional.empty();
        }

        return userRepository.findByEmail(name).map(user -> {
            String preferred = user.getNotificationEmail();
            if (preferred != null && !preferred.isBlank()) {
                return preferred.trim();
            }
            return user.getEmail();
        });
    }
}

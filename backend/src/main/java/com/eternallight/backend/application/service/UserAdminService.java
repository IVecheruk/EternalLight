package com.eternallight.backend.application.service;

import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.db.repository.UserRepository;
import com.eternallight.backend.infrastructure.security.RoleUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserAdminService {

    private final UserRepository userRepository;

    public UserAdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserEntity> list() {
        return userRepository.findAll();
    }

    @Transactional
    public UserEntity updateRole(Long id, String rawRole) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: id=" + id));
        String role = RoleUtils.requireAllowed(rawRole);
        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public UserEntity updateStatus(Long id, boolean active, String reason) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: id=" + id));
        if (active) {
            user.setIsActive(true);
            user.setBlockedReason(null);
        } else {
            String trimmed = reason == null ? "" : reason.trim();
            if (trimmed.isEmpty()) {
                throw new IllegalArgumentException("Blocked reason is required");
            }
            user.setIsActive(false);
            user.setBlockedReason(trimmed);
            user.setRole(RoleUtils.USER);
        }
        return userRepository.save(user);
    }
}

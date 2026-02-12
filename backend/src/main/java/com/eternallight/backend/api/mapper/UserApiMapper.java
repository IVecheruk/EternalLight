package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.UserResponse;
import com.eternallight.backend.infrastructure.db.entity.UserEntity;
import com.eternallight.backend.infrastructure.security.RoleUtils;

import java.util.List;

public final class UserApiMapper {

    private UserApiMapper() {}

    public static UserResponse toResponse(UserEntity user) {
        String role = RoleUtils.normalize(user.getRole());
        List<String> roles = role.isBlank() ? List.of() : List.of(role);
        boolean active = Boolean.TRUE.equals(user.getIsActive());
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                roles,
                user.getFullName(),
                active,
                user.getBlockedReason()
        );
    }
}

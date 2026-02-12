package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.UpdateUserRoleRequest;
import com.eternallight.backend.api.dto.request.UpdateUserStatusRequest;
import com.eternallight.backend.api.dto.response.UserResponse;
import com.eternallight.backend.api.mapper.UserApiMapper;
import com.eternallight.backend.application.service.UserAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserAdminService userAdminService;

    public UserController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    public List<UserResponse> list() {
        return userAdminService.list().stream()
                .map(UserApiMapper::toResponse)
                .toList();
    }

    @PutMapping("/{id}/role")
    public UserResponse updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        var updated = userAdminService.updateRole(id, request.role());
        return UserApiMapper.toResponse(updated);
    }

    @PutMapping("/{id}/status")
    public UserResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        var updated = userAdminService.updateStatus(id, request.active(), request.reason());
        return UserApiMapper.toResponse(updated);
    }
}

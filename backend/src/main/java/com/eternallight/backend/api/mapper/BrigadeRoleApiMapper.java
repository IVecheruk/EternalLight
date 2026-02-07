package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.BrigadeRoleResponse;
import com.eternallight.backend.domain.model.BrigadeRole;

public class BrigadeRoleApiMapper {
    private BrigadeRoleApiMapper() {}

    public static BrigadeRoleResponse toResponse(BrigadeRole r) {
        return new BrigadeRoleResponse(r.getId(), r.getCode(), r.getName());
    }
}

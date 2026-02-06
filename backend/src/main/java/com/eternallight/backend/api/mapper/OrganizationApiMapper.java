package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.OrganizationResponse;
import com.eternallight.backend.domain.model.Organization;

public class OrganizationApiMapper {
    private OrganizationApiMapper() {}

    public static OrganizationResponse toResponse(Organization o) {
        return new OrganizationResponse(o.getId(), o.getFullName(), o.getCity());
    }
}

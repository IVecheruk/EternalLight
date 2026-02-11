package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.StreetResponse;
import com.eternallight.backend.domain.model.Street;

public class StreetApiMapper {
    private StreetApiMapper() {}

    public static StreetResponse toResponse(Street s) {
        return new StreetResponse(s.getId(), s.getName(), s.getAdministrativeDistrictId());
    }
}

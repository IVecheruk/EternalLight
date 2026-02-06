package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.AdministrativeDistrictResponse;
import com.eternallight.backend.domain.model.AdministrativeDistrict;

public class AdministrativeDistrictApiMapper {
    private AdministrativeDistrictApiMapper() {}

    public static AdministrativeDistrictResponse toResponse(AdministrativeDistrict d) {
        return new AdministrativeDistrictResponse(d.getId(), d.getName());
    }
}

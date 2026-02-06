package com.eternallight.backend.api.mapper;

import com.eternallight.backend.api.dto.response.LightingObjectResponse;
import com.eternallight.backend.domain.model.LightingObject;

public class LightingObjectApiMapper {
    private LightingObjectApiMapper() {}

    public static LightingObjectResponse toResponse(LightingObject o) {
        return new LightingObjectResponse(
                o.getId(),
                o.getAdministrativeDistrictId(),
                o.getStreetId(),
                o.getHouseLandmark(),
                o.getGpsLatitude(),
                o.getGpsLongitude(),
                o.getOutdoorLineNumber(),
                o.getControlCabinetNumber(),
                o.getPoleNumber(),
                o.getLuminaireNumber(),
                o.getEquipmentInventoryNumber()
        );
    }
}

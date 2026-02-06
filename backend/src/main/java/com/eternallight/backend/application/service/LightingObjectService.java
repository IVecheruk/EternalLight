package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateLightingObjectRequest;
import com.eternallight.backend.api.dto.request.UpdateLightingObjectRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.LightingObject;
import com.eternallight.backend.infrastructure.db.entity.LightingObjectEntity;
import com.eternallight.backend.infrastructure.db.repository.AdministrativeDistrictRepository;
import com.eternallight.backend.infrastructure.db.repository.LightingObjectRepository;
import com.eternallight.backend.infrastructure.db.repository.StreetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LightingObjectService {

    private final LightingObjectRepository lightingObjectRepository;
    private final AdministrativeDistrictRepository administrativeDistrictRepository;
    private final StreetRepository streetRepository;

    public LightingObjectService(
            LightingObjectRepository lightingObjectRepository,
            AdministrativeDistrictRepository administrativeDistrictRepository,
            StreetRepository streetRepository
    ) {
        this.lightingObjectRepository = lightingObjectRepository;
        this.administrativeDistrictRepository = administrativeDistrictRepository;
        this.streetRepository = streetRepository;
    }

    @Transactional
    public LightingObject create(CreateLightingObjectRequest r) {
        validateRefs(r.administrativeDistrictId(), r.streetId());

        LightingObjectEntity e = new LightingObjectEntity(
                r.administrativeDistrictId(),
                r.streetId(),
                r.houseLandmark(),
                r.gpsLatitude(),
                r.gpsLongitude(),
                r.outdoorLineNumber(),
                r.controlCabinetNumber(),
                r.poleNumber(),
                r.luminaireNumber(),
                r.equipmentInventoryNumber()
        );

        return toDomain(lightingObjectRepository.save(e));
    }

    @Transactional(readOnly = true)
    public LightingObject getById(Long id) {
        LightingObjectEntity e = lightingObjectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lighting object not found: id=" + id));
        return toDomain(e);
    }

    @Transactional(readOnly = true)
    public List<LightingObject> list() {
        return lightingObjectRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Transactional
    public LightingObject update(Long id, UpdateLightingObjectRequest r) {
        LightingObjectEntity existing = lightingObjectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lighting object not found: id=" + id));

        validateRefs(r.administrativeDistrictId(), r.streetId());

        existing.setAdministrativeDistrictId(r.administrativeDistrictId());
        existing.setStreetId(r.streetId());
        existing.setHouseLandmark(r.houseLandmark());
        existing.setGpsLatitude(r.gpsLatitude());
        existing.setGpsLongitude(r.gpsLongitude());
        existing.setOutdoorLineNumber(r.outdoorLineNumber());
        existing.setControlCabinetNumber(r.controlCabinetNumber());
        existing.setPoleNumber(r.poleNumber());
        existing.setLuminaireNumber(r.luminaireNumber());
        existing.setEquipmentInventoryNumber(r.equipmentInventoryNumber());

        return toDomain(lightingObjectRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!lightingObjectRepository.existsById(id)) {
            throw new NotFoundException("Lighting object not found: id=" + id);
        }
        lightingObjectRepository.deleteById(id);
    }

    private void validateRefs(Long administrativeDistrictId, Long streetId) {
        if (administrativeDistrictId != null && !administrativeDistrictRepository.existsById(administrativeDistrictId)) {
            throw new NotFoundException("Administrative district not found: id=" + administrativeDistrictId);
        }
        if (streetId != null && !streetRepository.existsById(streetId)) {
            throw new NotFoundException("Street not found: id=" + streetId);
        }
    }

    private LightingObject toDomain(LightingObjectEntity e) {
        return new LightingObject(
                e.getId(),
                e.getAdministrativeDistrictId(),
                e.getStreetId(),
                e.getHouseLandmark(),
                e.getGpsLatitude(),
                e.getGpsLongitude(),
                e.getOutdoorLineNumber(),
                e.getControlCabinetNumber(),
                e.getPoleNumber(),
                e.getLuminaireNumber(),
                e.getEquipmentInventoryNumber()
        );
    }
}

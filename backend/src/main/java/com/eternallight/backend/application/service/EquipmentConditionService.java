package com.eternallight.backend.application.service;

import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.infrastructure.db.entity.EquipmentConditionEntity;
import com.eternallight.backend.infrastructure.db.repository.EquipmentConditionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentConditionService {

    private final EquipmentConditionRepository repo;

    public EquipmentConditionService(EquipmentConditionRepository repo) {
        this.repo = repo;
    }

    public EquipmentConditionEntity create(String code, String name) {
        return repo.save(new EquipmentConditionEntity(code.trim(), name.trim()));
    }

    public List<EquipmentConditionEntity> list() {
        return repo.findAll();
    }

    public EquipmentConditionEntity get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Condition not found: " + id));
    }
}

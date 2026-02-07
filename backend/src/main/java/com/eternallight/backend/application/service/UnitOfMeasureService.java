package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateUnitOfMeasureRequest;
import com.eternallight.backend.api.dto.request.UpdateUnitOfMeasureRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.UnitOfMeasure;
import com.eternallight.backend.infrastructure.db.entity.UnitOfMeasureEntity;
import com.eternallight.backend.infrastructure.db.repository.UnitOfMeasureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UnitOfMeasureService {

    private final UnitOfMeasureRepository repo;

    public UnitOfMeasureService(UnitOfMeasureRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public UnitOfMeasure create(CreateUnitOfMeasureRequest r) {
        return toDomain(repo.save(new UnitOfMeasureEntity(r.name().trim())));
    }

    @Transactional(readOnly = true)
    public UnitOfMeasure get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Unit of measure not found: id=" + id));
    }

    @Transactional(readOnly = true)
    public List<UnitOfMeasure> list() {
        return repo.findAll().stream().map(this::toDomain).toList();
    }

    @Transactional
    public UnitOfMeasure update(Long id, UpdateUnitOfMeasureRequest r) {
        UnitOfMeasureEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Unit of measure not found: id=" + id));
        e.setName(r.name().trim());
        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Unit of measure not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private UnitOfMeasure toDomain(UnitOfMeasureEntity e) {
        return new UnitOfMeasure(e.getId(), e.getName());
    }
}

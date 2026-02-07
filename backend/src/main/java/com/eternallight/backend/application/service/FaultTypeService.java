package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateFaultTypeRequest;
import com.eternallight.backend.api.dto.request.UpdateFaultTypeRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.FaultType;
import com.eternallight.backend.infrastructure.db.entity.FaultTypeEntity;
import com.eternallight.backend.infrastructure.db.repository.FaultTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FaultTypeService {

    private final FaultTypeRepository repo;

    public FaultTypeService(FaultTypeRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public FaultType create(CreateFaultTypeRequest r) {
        FaultTypeEntity e = new FaultTypeEntity(
                r.code().trim(),
                r.name().trim(),
                r.isOther()
        );
        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public FaultType get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Fault type not found: id=" + id));
    }

    @Transactional(readOnly = true)
    public List<FaultType> list() {
        return repo.findAll().stream().map(this::toDomain).toList();
    }

    @Transactional
    public FaultType update(Long id, UpdateFaultTypeRequest r) {
        FaultTypeEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Fault type not found: id=" + id));

        e.setCode(r.code().trim());
        e.setName(r.name().trim());
        e.setIsOther(r.isOther() != null ? r.isOther() : false);

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Fault type not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private FaultType toDomain(FaultTypeEntity e) {
        return new FaultType(e.getId(), e.getCode(), e.getName(), e.getIsOther());
    }
}

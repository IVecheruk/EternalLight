package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateWorkBasisTypeRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkBasisTypeRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkBasisType;
import com.eternallight.backend.infrastructure.db.entity.WorkBasisTypeEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkBasisTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkBasisTypeService {

    private final WorkBasisTypeRepository repo;

    public WorkBasisTypeService(WorkBasisTypeRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public WorkBasisType create(CreateWorkBasisTypeRequest r) {
        WorkBasisTypeEntity e = new WorkBasisTypeEntity(r.code().trim(), r.name().trim());
        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public WorkBasisType get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Work basis type not found: id=" + id));
    }

    @Transactional(readOnly = true)
    public List<WorkBasisType> list() {
        return repo.findAll().stream().map(this::toDomain).toList();
    }

    @Transactional
    public WorkBasisType update(Long id, UpdateWorkBasisTypeRequest r) {
        WorkBasisTypeEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Work basis type not found: id=" + id));

        e.setCode(r.code().trim());
        e.setName(r.name().trim());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Work basis type not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private WorkBasisType toDomain(WorkBasisTypeEntity e) {
        return new WorkBasisType(e.getId(), e.getCode(), e.getName());
    }
}

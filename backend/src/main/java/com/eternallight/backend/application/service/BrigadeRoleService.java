package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateBrigadeRoleRequest;
import com.eternallight.backend.api.dto.request.UpdateBrigadeRoleRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.BrigadeRole;
import com.eternallight.backend.infrastructure.db.entity.BrigadeRoleEntity;
import com.eternallight.backend.infrastructure.db.repository.BrigadeRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BrigadeRoleService {

    private final BrigadeRoleRepository repo;

    public BrigadeRoleService(BrigadeRoleRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public BrigadeRole create(CreateBrigadeRoleRequest r) {
        BrigadeRoleEntity e = new BrigadeRoleEntity(r.code().trim(), r.name().trim());
        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public BrigadeRole get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Brigade role not found: id=" + id));
    }

    @Transactional(readOnly = true)
    public List<BrigadeRole> list() {
        return repo.findAll().stream().map(this::toDomain).toList();
    }

    @Transactional
    public BrigadeRole update(Long id, UpdateBrigadeRoleRequest r) {
        BrigadeRoleEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Brigade role not found: id=" + id));

        e.setCode(r.code().trim());
        e.setName(r.name().trim());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Brigade role not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private BrigadeRole toDomain(BrigadeRoleEntity e) {
        return new BrigadeRole(e.getId(), e.getCode(), e.getName());
    }
}

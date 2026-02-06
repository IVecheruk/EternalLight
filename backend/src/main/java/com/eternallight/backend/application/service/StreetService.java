package com.eternallight.backend.application.service;

import com.eternallight.backend.domain.exception.ConflictException;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.Street;
import com.eternallight.backend.infrastructure.db.entity.StreetEntity;
import com.eternallight.backend.infrastructure.db.repository.StreetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StreetService {

    private final StreetRepository repository;

    public StreetService(StreetRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Street create(String name) {
        if (repository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Street with the same name already exists");
        }
        StreetEntity saved = repository.save(new StreetEntity(name));
        return new Street(saved.getId(), saved.getName());
    }

    @Transactional(readOnly = true)
    public Street getById(Long id) {
        StreetEntity e = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Street not found: id=" + id));
        return new Street(e.getId(), e.getName());
    }

    @Transactional(readOnly = true)
    public List<Street> list() {
        return repository.findAll().stream()
                .map(e -> new Street(e.getId(), e.getName()))
                .toList();
    }

    @Transactional
    public Street update(Long id, String name) {
        StreetEntity e = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Street not found: id=" + id));

        if (!e.getName().equalsIgnoreCase(name) && repository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Street with the same name already exists");
        }

        e.setName(name);
        StreetEntity saved = repository.save(e);
        return new Street(saved.getId(), saved.getName());
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Street not found: id=" + id);
        }
        repository.deleteById(id);
    }
}

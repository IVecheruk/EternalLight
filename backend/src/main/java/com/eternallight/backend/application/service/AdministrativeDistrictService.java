package com.eternallight.backend.application.service;

import com.eternallight.backend.domain.exception.ConflictException;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.AdministrativeDistrict;
import com.eternallight.backend.infrastructure.db.entity.AdministrativeDistrictEntity;
import com.eternallight.backend.infrastructure.db.repository.AdministrativeDistrictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdministrativeDistrictService {

    private final AdministrativeDistrictRepository repository;

    public AdministrativeDistrictService(AdministrativeDistrictRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public AdministrativeDistrict create(
            String name
    ) {
        if (repository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Административный округ с таким названием уже существует");
        }
        AdministrativeDistrictEntity saved = repository.save(new AdministrativeDistrictEntity(name));
        return new AdministrativeDistrict(saved.getId(), saved.getName());
    }

    @Transactional(readOnly = true)
    public AdministrativeDistrict getById(
            Long id
    ) {
        AdministrativeDistrictEntity e = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Административный район не найден: id=" + id));
        return new AdministrativeDistrict(e.getId(), e.getName());
    }

    @Transactional(readOnly = true)
    public List<AdministrativeDistrict> list() {
        return repository
                .findAll()
                .stream()
                .map(e -> new AdministrativeDistrict(e.getId(), e.getName()))
                .toList();
    }

    @Transactional
    public AdministrativeDistrict update(
            Long id,
            String name
    ) {
        AdministrativeDistrictEntity e = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Административный район не найден: id=" + id));

        if (!e.getName().equalsIgnoreCase(name) && repository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Административный округ с таким названием уже существует");
        }

        e.setName(name);
        AdministrativeDistrictEntity saved = repository.save(e);
        return new AdministrativeDistrict(saved.getId(), saved.getName());
    }

    @Transactional
    public void delete(
            Long id
    ) {
        if(!repository.existsById(id)) {
            throw new NotFoundException("Административный район не найден: id=" + id);
        }
        repository.deleteById(id);
    }
}
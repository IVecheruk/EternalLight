package com.eternallight.backend.application.service;

import com.eternallight.backend.domain.exception.ConflictException;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.Organization;
import com.eternallight.backend.infrastructure.db.entity.OrganizationEntity;
import com.eternallight.backend.infrastructure.db.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrganizationService {

    private final OrganizationRepository repository;

    public OrganizationService(
            OrganizationRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional
    public Organization create(
            String fullName,
            String city
    ) {
        if(repository.existsByFullNameIgnoreCase(fullName)) {
            throw new ConflictException("Организация с таким же полным названием уже существует");
        }
        OrganizationEntity saved = repository.save(new OrganizationEntity(fullName, city));
        return new Organization(saved.getId(), saved.getFullName(), saved.getCity());
    }

    @Transactional(readOnly = true)
    public Organization getById(
            Long id
    ) {
        OrganizationEntity e = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(("Организация не найдена: идентификатор=" + id)));
        return new Organization(e.getId(), e.getFullName(), e.getCity());
    }

    @Transactional(readOnly = true)
    public List<Organization> list() {
        return repository.findAll().stream()
                .map(e -> new Organization(e.getId(), e.getFullName(), e.getCity()))
                .toList();
    }

    @Transactional
    public Organization update(
            Long id,
            String fullName,
            String city
    ) {
        OrganizationEntity e = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Организация не найдена: идентификатор=" + id));

        // Если меняем имя то проверяем уникальность
        if (!e.getFullName().equalsIgnoreCase(fullName) && repository.existsByFullNameIgnoreCase(fullName)) {
            throw new ConflictException("Организация с таким же полным названием уже существует");
        }

        e.setFullName(fullName);
        e.setCity(city);
        OrganizationEntity saved = repository.save(e);

        return new Organization(saved.getId(), saved.getFullName(), saved.getCity());
    }

    @Transactional
    public void delete(
            Long id
    ) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Организация не найдена: идентификатор=" + id);
        }
        repository.deleteById(id);
    }
}
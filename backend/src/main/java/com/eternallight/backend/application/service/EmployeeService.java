package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateEmployeeRequest;
import com.eternallight.backend.api.dto.request.UpdateEmployeeRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.Employee;
import com.eternallight.backend.infrastructure.db.entity.EmployeeEntity;
import com.eternallight.backend.infrastructure.db.repository.EmployeeRepository;
import com.eternallight.backend.infrastructure.db.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;
    private final OrganizationRepository organizationRepository;

    public EmployeeService(EmployeeRepository repo, OrganizationRepository organizationRepository) {
        this.repo = repo;
        this.organizationRepository = organizationRepository;
    }

    @Transactional
    public Employee create(CreateEmployeeRequest r) {
        validateOrg(r.organizationId());
        EmployeeEntity e = new EmployeeEntity(
                r.fullName().trim(),
                r.position(),
                r.employeeNumber(),
                r.electricalSafetyGroup(),
                r.organizationId()
        );
        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public Employee get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Employee not found: id=" + id));
    }

    @Transactional(readOnly = true)
    public List<Employee> list() {
        return repo.findAll().stream().map(this::toDomain).toList();
    }

    @Transactional
    public Employee update(Long id, UpdateEmployeeRequest r) {
        validateOrg(r.organizationId());
        EmployeeEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found: id=" + id));

        e.setFullName(r.fullName().trim());
        e.setPosition(r.position());
        e.setEmployeeNumber(r.employeeNumber());
        e.setElectricalSafetyGroup(r.electricalSafetyGroup());
        e.setOrganizationId(r.organizationId());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Employee not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private void validateOrg(Long organizationId) {
        if (organizationId != null && !organizationRepository.existsById(organizationId)) {
            throw new NotFoundException("Organization not found: id=" + organizationId);
        }
    }

    private Employee toDomain(EmployeeEntity e) {
        return new Employee(
                e.getId(),
                e.getFullName(),
                e.getPosition(),
                e.getEmployeeNumber(),
                e.getElectricalSafetyGroup(),
                e.getOrganizationId()
        );
    }
}

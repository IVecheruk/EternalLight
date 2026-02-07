package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActEquipmentUsageRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActEquipmentUsageRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActEquipmentUsage;
import com.eternallight.backend.infrastructure.db.entity.WorkActEquipmentUsageEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkActEquipmentUsageRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActEquipmentUsageService {

    private final WorkActEquipmentUsageRepository repo;
    private final WorkActRepository workActRepository;

    public WorkActEquipmentUsageService(WorkActEquipmentUsageRepository repo, WorkActRepository workActRepository) {
        this.repo = repo;
        this.workActRepository = workActRepository;
    }

    @Transactional
    public WorkActEquipmentUsage add(Long workActId, AddWorkActEquipmentUsageRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }

        WorkActEquipmentUsageEntity e = new WorkActEquipmentUsageEntity(
                workActId,
                r.seq(),
                r.equipmentName().trim(),
                r.registrationOrInventoryNumber(),
                r.usedHours(),
                r.machineHourCost(),
                r.lineTotal()
        );

        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public List<WorkActEquipmentUsage> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return repo.findAllByWorkActIdOrderBySeqAsc(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional(readOnly = true)
    public WorkActEquipmentUsage get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Equipment usage line not found: id=" + id));
    }

    @Transactional
    public WorkActEquipmentUsage update(Long id, UpdateWorkActEquipmentUsageRequest r) {
        WorkActEquipmentUsageEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment usage line not found: id=" + id));

        if (r.seq() != null) e.setSeq(r.seq());
        if (r.equipmentName() != null) e.setEquipmentName(r.equipmentName().trim());
        e.setRegistrationOrInventoryNumber(r.registrationOrInventoryNumber());
        e.setUsedHours(r.usedHours());
        e.setMachineHourCost(r.machineHourCost());
        e.setLineTotal(r.lineTotal());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Equipment usage line not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private WorkActEquipmentUsage toDomain(WorkActEquipmentUsageEntity e) {
        return new WorkActEquipmentUsage(
                e.getId(),
                e.getWorkActId(),
                e.getSeq(),
                e.getEquipmentName(),
                e.getRegistrationOrInventoryNumber(),
                e.getUsedHours(),
                e.getMachineHourCost(),
                e.getLineTotal()
        );
    }
}

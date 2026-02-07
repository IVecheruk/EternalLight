package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.UpsertWorkActInstalledEquipmentRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.infrastructure.db.entity.WorkActInstalledEquipmentEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkActInstalledEquipmentRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActInstalledEquipmentService {

    private final WorkActInstalledEquipmentRepository repo;
    private final WorkActRepository workActRepo;

    public WorkActInstalledEquipmentService(
            WorkActInstalledEquipmentRepository repo,
            WorkActRepository workActRepo
    ) {
        this.repo = repo;
        this.workActRepo = workActRepo;
    }

    @Transactional
    public WorkActInstalledEquipmentEntity create(Long workActId, UpsertWorkActInstalledEquipmentRequest r) {
        ensureWorkActExists(workActId);

        var e = WorkActInstalledEquipmentEntity.create(workActId);
        apply(e, r);

        return repo.save(e);
    }

    @Transactional(readOnly = true)
    public List<WorkActInstalledEquipmentEntity> list(Long workActId) {
        ensureWorkActExists(workActId);
        return repo.findAllByWorkActIdOrderBySeqAscIdAsc(workActId);
    }

    @Transactional(readOnly = true)
    public WorkActInstalledEquipmentEntity get(Long workActId, Long id) {
        ensureWorkActExists(workActId);
        return repo.findByIdAndWorkActId(id, workActId)
                .orElseThrow(() -> new NotFoundException("Installed equipment not found: id=" + id));
    }

    @Transactional
    public WorkActInstalledEquipmentEntity update(Long workActId, Long id, UpsertWorkActInstalledEquipmentRequest r) {
        var e = get(workActId, id);
        apply(e, r);
        return repo.save(e);
    }

    @Transactional
    public void delete(Long workActId, Long id) {
        ensureWorkActExists(workActId);

        if (!repo.existsByIdAndWorkActId(id, workActId)) {
            throw new NotFoundException("Installed equipment not found: id=" + id);
        }

        repo.deleteByIdAndWorkActId(id, workActId);
    }

    private void ensureWorkActExists(Long workActId) {
        if (!workActRepo.existsById(workActId)) {
            throw new NotFoundException("WorkAct not found: " + workActId);
        }
    }

    private void apply(WorkActInstalledEquipmentEntity e, UpsertWorkActInstalledEquipmentRequest r) {
        e.setSeq(r.seq());
        e.setName(r.name());
        e.setModel(r.model());
        e.setSerialNumber(r.serialNumber());
        e.setManufactureYear(r.manufactureYear());
        e.setQuantity(r.quantity());
        e.setInstalledOn(r.installedOn());
        e.setWarrantyMonths(r.warrantyMonths());
        e.setWarrantyUntil(r.warrantyUntil());
        e.setPassportOrCertificateNumber(r.passportOrCertificateNumber());
    }
}

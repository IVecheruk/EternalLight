package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.UpsertWorkActDismantledEquipmentRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.infrastructure.db.entity.WorkActDismantledEquipmentEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkActDismantledEquipmentRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActDismantledEquipmentService {

    private final WorkActDismantledEquipmentRepository repo;
    private final WorkActRepository workActRepo;

    public WorkActDismantledEquipmentService(
            WorkActDismantledEquipmentRepository repo,
            WorkActRepository workActRepo
    ) {
        this.repo = repo;
        this.workActRepo = workActRepo;
    }

    @Transactional
    public WorkActDismantledEquipmentEntity create(Long workActId, UpsertWorkActDismantledEquipmentRequest r) {
        ensureWorkActExists(workActId);
        var e = WorkActDismantledEquipmentEntity.create(workActId);
        apply(e, r);
        return repo.save(e);
    }

    @Transactional(readOnly = true)
    public List<WorkActDismantledEquipmentEntity> list(Long workActId) {
        ensureWorkActExists(workActId);
        return repo.findAllByWorkActIdOrderBySeqAscIdAsc(workActId);
    }

    @Transactional(readOnly = true)
    public WorkActDismantledEquipmentEntity get(Long workActId, Long id) {
        ensureWorkActExists(workActId);
        return repo.findByIdAndWorkActId(id, workActId)
                .orElseThrow(() -> new NotFoundException("Dismantled equipment not found: id=" + id));
    }

    @Transactional
    public WorkActDismantledEquipmentEntity update(Long workActId, Long id, UpsertWorkActDismantledEquipmentRequest r) {
        var e = get(workActId, id);
        apply(e, r);
        return repo.save(e);
    }

    @Transactional
    public void delete(Long workActId, Long id) {
        ensureWorkActExists(workActId);
        if (!repo.existsByIdAndWorkActId(id, workActId)) {
            throw new NotFoundException("Dismantled equipment not found: id=" + id);
        }
        repo.deleteByIdAndWorkActId(id, workActId);
    }

    private void ensureWorkActExists(Long workActId) {
        if (!workActRepo.existsById(workActId)) {
            throw new NotFoundException("WorkAct not found: " + workActId);
        }
    }

    private void apply(WorkActDismantledEquipmentEntity e, UpsertWorkActDismantledEquipmentRequest r) {
        e.setSeq(r.seq());
        e.setName(r.name());
        e.setModel(r.model());
        e.setSerialNumber(r.serialNumber());
        e.setManufactureYear(r.manufactureYear());
        e.setQuantity(r.quantity());
        e.setEquipmentConditionId(r.equipmentConditionId());
        e.setStorageOrTransferPlace(r.storageOrTransferPlace());
    }
}

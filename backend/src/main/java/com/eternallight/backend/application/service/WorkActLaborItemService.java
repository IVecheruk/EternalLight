package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActLaborItemRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActLaborItemRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActLaborItem;
import com.eternallight.backend.infrastructure.db.entity.WorkActLaborItemEntity;
import com.eternallight.backend.infrastructure.db.repository.UnitOfMeasureRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActLaborItemRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActLaborItemService {

    private final WorkActLaborItemRepository repo;
    private final WorkActRepository workActRepository;
    private final UnitOfMeasureRepository uomRepository;

    public WorkActLaborItemService(
            WorkActLaborItemRepository repo,
            WorkActRepository workActRepository,
            UnitOfMeasureRepository uomRepository
    ) {
        this.repo = repo;
        this.workActRepository = workActRepository;
        this.uomRepository = uomRepository;
    }

    @Transactional
    public WorkActLaborItem add(Long workActId, AddWorkActLaborItemRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        validateUom(r.uomId());

        WorkActLaborItemEntity e = new WorkActLaborItemEntity(
                workActId,
                r.seq(),
                r.workTypeName().trim(),
                r.uomId(),
                r.workVolume(),
                r.normHours(),
                r.actualHours(),
                r.rateAmount(),
                r.costAmount()
        );

        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public List<WorkActLaborItem> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return repo.findAllByWorkActIdOrderBySeqAsc(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional(readOnly = true)
    public WorkActLaborItem get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Labor item not found: id=" + id));
    }

    @Transactional
    public WorkActLaborItem update(Long id, UpdateWorkActLaborItemRequest r) {
        WorkActLaborItemEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Labor item not found: id=" + id));

        if (r.uomId() != null) validateUom(r.uomId());

        if (r.seq() != null) e.setSeq(r.seq());
        if (r.workTypeName() != null) e.setWorkTypeName(r.workTypeName().trim());
        e.setUomId(r.uomId());
        e.setWorkVolume(r.workVolume());
        e.setNormHours(r.normHours());
        e.setActualHours(r.actualHours());
        e.setRateAmount(r.rateAmount());
        e.setCostAmount(r.costAmount());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Labor item not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private void validateUom(Long uomId) {
        if (uomId != null && !uomRepository.existsById(uomId)) {
            throw new NotFoundException("Unit of measure not found: id=" + uomId);
        }
    }

    private WorkActLaborItem toDomain(WorkActLaborItemEntity e) {
        return new WorkActLaborItem(
                e.getId(),
                e.getWorkActId(),
                e.getSeq(),
                e.getWorkTypeName(),
                e.getUomId(),
                e.getWorkVolume(),
                e.getNormHours(),
                e.getActualHours(),
                e.getRateAmount(),
                e.getCostAmount()
        );
    }
}

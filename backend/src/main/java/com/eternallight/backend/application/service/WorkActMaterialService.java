package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActMaterialRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActMaterialRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActMaterial;
import com.eternallight.backend.infrastructure.db.entity.WorkActMaterialEntity;
import com.eternallight.backend.infrastructure.db.repository.UnitOfMeasureRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActMaterialRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActMaterialService {

    private final WorkActMaterialRepository repo;
    private final WorkActRepository workActRepository;
    private final UnitOfMeasureRepository uomRepository;

    public WorkActMaterialService(
            WorkActMaterialRepository repo,
            WorkActRepository workActRepository,
            UnitOfMeasureRepository uomRepository
    ) {
        this.repo = repo;
        this.workActRepository = workActRepository;
        this.uomRepository = uomRepository;
    }

    @Transactional
    public WorkActMaterial add(Long workActId, AddWorkActMaterialRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        validateUom(r.uomId());

        WorkActMaterialEntity e = new WorkActMaterialEntity(
                workActId,
                r.seq(),
                r.name().trim(),
                r.modelOrArticle(),
                r.uomId(),
                r.quantity(),
                r.unitPrice(),
                r.lineTotal()
        );

        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public List<WorkActMaterial> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return repo.findAllByWorkActIdOrderBySeqAsc(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional(readOnly = true)
    public WorkActMaterial get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Material line not found: id=" + id));
    }

    @Transactional
    public WorkActMaterial update(Long id, UpdateWorkActMaterialRequest r) {
        WorkActMaterialEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Material line not found: id=" + id));

        if (r.uomId() != null) validateUom(r.uomId());

        if (r.seq() != null) e.setSeq(r.seq());
        if (r.name() != null) e.setName(r.name().trim());
        e.setModelOrArticle(r.modelOrArticle());
        e.setUomId(r.uomId());
        e.setQuantity(r.quantity());
        e.setUnitPrice(r.unitPrice());
        e.setLineTotal(r.lineTotal());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Material line not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private void validateUom(Long uomId) {
        if (uomId != null && !uomRepository.existsById(uomId)) {
            throw new NotFoundException("Unit of measure not found: id=" + uomId);
        }
    }

    private WorkActMaterial toDomain(WorkActMaterialEntity e) {
        return new WorkActMaterial(
                e.getId(),
                e.getWorkActId(),
                e.getSeq(),
                e.getName(),
                e.getModelOrArticle(),
                e.getUomId(),
                e.getQuantity(),
                e.getUnitPrice(),
                e.getLineTotal()
        );
    }
}

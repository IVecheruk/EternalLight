package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActBasisRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActBasisRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActBasis;
import com.eternallight.backend.infrastructure.db.entity.WorkActBasisEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkActBasisRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkBasisTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActBasisService {

    private final WorkActBasisRepository basisRepository;
    private final WorkActRepository workActRepository;
    private final WorkBasisTypeRepository workBasisTypeRepository;

    public WorkActBasisService(
            WorkActBasisRepository basisRepository,
            WorkActRepository workActRepository,
            WorkBasisTypeRepository workBasisTypeRepository
    ) {
        this.basisRepository = basisRepository;
        this.workActRepository = workActRepository;
        this.workBasisTypeRepository = workBasisTypeRepository;
    }

    @Transactional
    public WorkActBasis add(Long workActId, AddWorkActBasisRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        if (!workBasisTypeRepository.existsById(r.workBasisTypeId())) {
            throw new NotFoundException("Work basis type not found: id=" + r.workBasisTypeId());
        }

        WorkActBasisEntity e = new WorkActBasisEntity(
                workActId,
                r.workBasisTypeId(),
                r.isSelected(),
                r.documentNumber(),
                r.documentDate()
        );

        return toDomain(basisRepository.save(e));
    }

    @Transactional(readOnly = true)
    public List<WorkActBasis> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return basisRepository.findAllByWorkActId(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional
    public WorkActBasis update(Long workActId, Long workBasisTypeId, UpdateWorkActBasisRequest r) {
        WorkActBasisEntity e = basisRepository.findByWorkActIdAndWorkBasisTypeId(workActId, workBasisTypeId)
                .orElseThrow(() -> new NotFoundException("Work act basis not found: workActId=" + workActId + ", workBasisTypeId=" + workBasisTypeId));

        if (r.isSelected() != null) e.setIsSelected(r.isSelected());
        e.setDocumentNumber(r.documentNumber());
        e.setDocumentDate(r.documentDate());

        return toDomain(basisRepository.save(e));
    }

    @Transactional
    public void delete(Long workActId, Long workBasisTypeId) {
        WorkActBasisEntity e = basisRepository.findByWorkActIdAndWorkBasisTypeId(workActId, workBasisTypeId)
                .orElseThrow(() -> new NotFoundException("Work act basis not found: workActId=" + workActId + ", workBasisTypeId=" + workBasisTypeId));
        basisRepository.delete(e);
    }

    private WorkActBasis toDomain(WorkActBasisEntity e) {
        return new WorkActBasis(
                e.getId(),
                e.getWorkActId(),
                e.getWorkBasisTypeId(),
                e.getIsSelected(),
                e.getDocumentNumber(),
                e.getDocumentDate()
        );
    }
}

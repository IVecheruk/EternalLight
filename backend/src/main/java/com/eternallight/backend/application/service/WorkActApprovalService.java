package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.UpsertWorkActApprovalRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActApproval;
import com.eternallight.backend.infrastructure.db.entity.WorkActApprovalEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkActApprovalRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkActApprovalService {

    private final WorkActApprovalRepository approvalRepository;
    private final WorkActRepository workActRepository;

    public WorkActApprovalService(
            WorkActApprovalRepository approvalRepository,
            WorkActRepository workActRepository
    ) {
        this.approvalRepository = approvalRepository;
        this.workActRepository = workActRepository;
    }

    /**
     * Upsert: если записи нет — создаём, если есть — обновляем.
     */
    @Transactional
    public WorkActApproval upsert(Long workActId, UpsertWorkActApprovalRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }

        WorkActApprovalEntity entity = approvalRepository.findById(workActId)
                .orElseGet(() -> new WorkActApprovalEntity(workActId, null, null, null, null));

        entity.setApproverPosition(r.approverPosition());
        entity.setApproverFullName(r.approverFullName());
        entity.setApprovalDate(r.approvalDate());
        entity.setStampPresent(r.stampPresent());

        return toDomain(approvalRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public WorkActApproval get(Long workActId) {
        WorkActApprovalEntity entity = approvalRepository.findById(workActId)
                .orElseThrow(() -> new NotFoundException("Work act approval not found: workActId=" + workActId));
        return toDomain(entity);
    }

    @Transactional
    public void delete(Long workActId) {
        if (!approvalRepository.existsById(workActId)) {
            throw new NotFoundException("Work act approval not found: workActId=" + workActId);
        }
        approvalRepository.deleteById(workActId);
    }

    private WorkActApproval toDomain(WorkActApprovalEntity e) {
        return new WorkActApproval(
                e.getWorkActId(),
                e.getApproverPosition(),
                e.getApproverFullName(),
                e.getApprovalDate(),
                e.getStampPresent()
        );
    }
}

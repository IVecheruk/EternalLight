package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActFaultRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActFaultRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActFault;
import com.eternallight.backend.infrastructure.notification.NotificationService;
import com.eternallight.backend.infrastructure.db.entity.WorkActFaultEntity;
import com.eternallight.backend.infrastructure.db.repository.FaultTypeRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActFaultRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActFaultService {

    private final WorkActFaultRepository repo;
    private final WorkActRepository workActRepository;
    private final FaultTypeRepository faultTypeRepository;
    private final NotificationService notificationService;

    public WorkActFaultService(
            WorkActFaultRepository repo,
            WorkActRepository workActRepository,
            FaultTypeRepository faultTypeRepository,
            NotificationService notificationService
    ) {
        this.repo = repo;
        this.workActRepository = workActRepository;
        this.faultTypeRepository = faultTypeRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public WorkActFault add(Long workActId, AddWorkActFaultRequest r) {
        var workAct = workActRepository.findById(workActId)
                .orElseThrow(() -> new NotFoundException("Work act not found: id=" + workActId));
        var faultType = faultTypeRepository.findById(r.faultTypeId())
                .orElseThrow(() -> new NotFoundException("Fault type not found: id=" + r.faultTypeId()));

        WorkActFaultEntity e = new WorkActFaultEntity(
                workActId,
                r.faultTypeId(),
                r.isSelected(),
                r.otherText()
        );
        WorkActFault saved = toDomain(repo.save(e));
        notificationService.sendFaultAdded(
                workActId,
                workAct.getActNumber(),
                faultType.getId(),
                faultType.getName(),
                r.isSelected(),
                r.otherText()
        );
        return saved;
    }

    @Transactional(readOnly = true)
    public List<WorkActFault> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return repo.findAllByWorkActId(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional
    public WorkActFault update(Long workActId, Long faultTypeId, UpdateWorkActFaultRequest r) {
        WorkActFaultEntity e = repo.findByWorkActIdAndFaultTypeId(workActId, faultTypeId)
                .orElseThrow(() -> new NotFoundException(
                        "Work act fault not found: workActId=" + workActId + ", faultTypeId=" + faultTypeId));

        if (r.isSelected() != null) e.setIsSelected(r.isSelected());
        e.setOtherText(r.otherText());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long workActId, Long faultTypeId) {
        WorkActFaultEntity e = repo.findByWorkActIdAndFaultTypeId(workActId, faultTypeId)
                .orElseThrow(() -> new NotFoundException(
                        "Work act fault not found: workActId=" + workActId + ", faultTypeId=" + faultTypeId));
        repo.delete(e);
    }

    private WorkActFault toDomain(WorkActFaultEntity e) {
        return new WorkActFault(
                e.getId(),
                e.getWorkActId(),
                e.getFaultTypeId(),
                e.getIsSelected(),
                e.getOtherText()
        );
    }
}

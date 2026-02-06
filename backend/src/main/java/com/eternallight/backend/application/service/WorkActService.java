package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.CreateWorkActRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkAct;
import com.eternallight.backend.infrastructure.db.entity.WorkActEntity;
import com.eternallight.backend.infrastructure.db.repository.LightingObjectRepository;
import com.eternallight.backend.infrastructure.db.repository.OrganizationRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkActService {

    private final WorkActRepository workActRepository;
    private final OrganizationRepository organizationRepository;
    private final LightingObjectRepository lightingObjectRepository;

    public WorkActService(
            WorkActRepository workActRepository,
            OrganizationRepository organizationRepository,
            LightingObjectRepository lightingObjectRepository
    ) {
        this.workActRepository = workActRepository;
        this.organizationRepository = organizationRepository;
        this.lightingObjectRepository = lightingObjectRepository;
    }

    @Transactional
    public WorkAct create(CreateWorkActRequest r) {
        validateRefs(r.executorOrgId(), r.lightingObjectId());

        WorkActEntity entity = new WorkActEntity(
                r.actNumber(),
                r.actCompiledOn(),
                r.actPlace(),
                r.executorOrgId(),
                r.structuralUnit(),
                r.lightingObjectId(),
                r.workStartedAt(),
                r.workFinishedAt(),
                r.totalDurationMinutes(),
                r.actualWorkMinutes(),
                r.downtimeMinutes(),
                r.downtimeReason(),
                r.faultDetails(),
                r.faultCause(),
                r.qualityRemarks(),
                r.otherExpensesAmount(),
                r.materialsTotalAmount(),
                r.worksTotalAmount(),
                r.transportTotalAmount(),
                r.grandTotalAmount(),
                r.grandTotalInWords(),
                r.warrantyWorkMonths(),
                r.warrantyWorkStart(),
                r.warrantyWorkEnd(),
                r.warrantyEquipmentMonths(),
                r.warrantyTerms(),
                r.copiesCount(),
                r.acceptedWithoutRemarks()
        );

        return toDomain(workActRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public WorkAct getById(Long id) {
        WorkActEntity e = workActRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Work act not found: id=" + id));
        return toDomain(e);
    }

    /**
     * Полный list:
     * - если executorOrgId и lightingObjectId заданы -> фильтр по обоим
     * - если задан только один -> по нему
     * - если actNumber задан -> поиск по номеру (contains, ignore case)
     * - если ничего не задано -> все
     */
    @Transactional(readOnly = true)
    public Page<WorkAct> list(Long executorOrgId, Long lightingObjectId, String actNumber, Pageable pageable) {
        Page<WorkActEntity> page;

        if (actNumber != null && !actNumber.isBlank()) {
            page = workActRepository.findAllByActNumberContainingIgnoreCase(actNumber.trim(), pageable);
        } else if (executorOrgId != null && lightingObjectId != null) {
            page = workActRepository.findAllByExecutorOrgIdAndLightingObjectId(executorOrgId, lightingObjectId, pageable);
        } else if (executorOrgId != null) {
            page = workActRepository.findAllByExecutorOrgId(executorOrgId, pageable);
        } else if (lightingObjectId != null) {
            page = workActRepository.findAllByLightingObjectId(lightingObjectId, pageable);
        } else {
            page = workActRepository.findAll(pageable);
        }

        return page.map(this::toDomain);
    }

    @Transactional
    public WorkAct update(Long id, UpdateWorkActRequest r) {
        WorkActEntity existing = workActRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Work act not found: id=" + id));

        validateRefs(r.executorOrgId(), r.lightingObjectId());

        existing.setActNumber(r.actNumber());
        existing.setActCompiledOn(r.actCompiledOn());
        existing.setActPlace(r.actPlace());
        existing.setExecutorOrgId(r.executorOrgId());
        existing.setStructuralUnit(r.structuralUnit());
        existing.setLightingObjectId(r.lightingObjectId());
        existing.setWorkStartedAt(r.workStartedAt());
        existing.setWorkFinishedAt(r.workFinishedAt());
        existing.setTotalDurationMinutes(r.totalDurationMinutes());
        existing.setActualWorkMinutes(r.actualWorkMinutes());
        existing.setDowntimeMinutes(r.downtimeMinutes());
        existing.setDowntimeReason(r.downtimeReason());
        existing.setFaultDetails(r.faultDetails());
        existing.setFaultCause(r.faultCause());
        existing.setQualityRemarks(r.qualityRemarks());
        existing.setOtherExpensesAmount(r.otherExpensesAmount());
        existing.setMaterialsTotalAmount(r.materialsTotalAmount());
        existing.setWorksTotalAmount(r.worksTotalAmount());
        existing.setTransportTotalAmount(r.transportTotalAmount());
        existing.setGrandTotalAmount(r.grandTotalAmount());
        existing.setGrandTotalInWords(r.grandTotalInWords());
        existing.setWarrantyWorkMonths(r.warrantyWorkMonths());
        existing.setWarrantyWorkStart(r.warrantyWorkStart());
        existing.setWarrantyWorkEnd(r.warrantyWorkEnd());
        existing.setWarrantyEquipmentMonths(r.warrantyEquipmentMonths());
        existing.setWarrantyTerms(r.warrantyTerms());
        existing.setCopiesCount(r.copiesCount());
        existing.setAcceptedWithoutRemarks(r.acceptedWithoutRemarks());

        return toDomain(workActRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!workActRepository.existsById(id)) {
            throw new NotFoundException("Work act not found: id=" + id);
        }
        workActRepository.deleteById(id);
    }

    private void validateRefs(Long executorOrgId, Long lightingObjectId) {
        if (!organizationRepository.existsById(executorOrgId)) {
            throw new NotFoundException("Organization not found: id=" + executorOrgId);
        }
        if (lightingObjectId != null && !lightingObjectRepository.existsById(lightingObjectId)) {
            throw new NotFoundException("Lighting object not found: id=" + lightingObjectId);
        }
    }

    private WorkAct toDomain(WorkActEntity e) {
        return new WorkAct(
                e.getId(),
                e.getActNumber(),
                e.getActCompiledOn(),
                e.getActPlace(),
                e.getExecutorOrgId(),
                e.getStructuralUnit(),
                e.getLightingObjectId(),
                e.getWorkStartedAt(),
                e.getWorkFinishedAt(),
                e.getTotalDurationMinutes(),
                e.getActualWorkMinutes(),
                e.getDowntimeMinutes(),
                e.getDowntimeReason(),
                e.getFaultDetails(),
                e.getFaultCause(),
                e.getQualityRemarks(),
                e.getOtherExpensesAmount(),
                e.getMaterialsTotalAmount(),
                e.getWorksTotalAmount(),
                e.getTransportTotalAmount(),
                e.getGrandTotalAmount(),
                e.getGrandTotalInWords(),
                e.getWarrantyWorkMonths(),
                e.getWarrantyWorkStart(),
                e.getWarrantyWorkEnd(),
                e.getWarrantyEquipmentMonths(),
                e.getWarrantyTerms(),
                e.getCopiesCount(),
                e.getAcceptedWithoutRemarks()
        );
    }
}

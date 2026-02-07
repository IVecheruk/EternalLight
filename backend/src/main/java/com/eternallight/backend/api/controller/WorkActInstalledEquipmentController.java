package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.UpsertWorkActInstalledEquipmentRequest;
import com.eternallight.backend.api.dto.response.WorkActInstalledEquipmentResponse;
import com.eternallight.backend.application.service.WorkActInstalledEquipmentService;
import com.eternallight.backend.infrastructure.db.entity.WorkActInstalledEquipmentEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/installed-equipment")
public class WorkActInstalledEquipmentController {

    private final WorkActInstalledEquipmentService service;

    public WorkActInstalledEquipmentController(WorkActInstalledEquipmentService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActInstalledEquipmentResponse create(
            @PathVariable Long workActId,
            @Valid @RequestBody UpsertWorkActInstalledEquipmentRequest r
    ) {
        return toResponse(service.create(workActId, r));
    }

    @GetMapping
    public List<WorkActInstalledEquipmentResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public WorkActInstalledEquipmentResponse get(
            @PathVariable Long workActId,
            @PathVariable Long id
    ) {
        return toResponse(service.get(workActId, id));
    }

    @PutMapping("/{id}")
    public WorkActInstalledEquipmentResponse update(
            @PathVariable Long workActId,
            @PathVariable Long id,
            @Valid @RequestBody UpsertWorkActInstalledEquipmentRequest r
    ) {
        return toResponse(service.update(workActId, id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long workActId, @PathVariable Long id) {
        service.delete(workActId, id);
    }

    private WorkActInstalledEquipmentResponse toResponse(WorkActInstalledEquipmentEntity e) {
        return new WorkActInstalledEquipmentResponse(
                e.getId(),
                e.getWorkActId(),
                e.getSeq(),
                e.getName(),
                e.getModel(),
                e.getSerialNumber(),
                e.getManufactureYear(),
                e.getQuantity(),
                e.getInstalledOn(),
                e.getWarrantyMonths(),
                e.getWarrantyUntil(),
                e.getPassportOrCertificateNumber()
        );
    }
}

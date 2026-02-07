package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.UpsertWorkActDismantledEquipmentRequest;
import com.eternallight.backend.api.dto.response.WorkActDismantledEquipmentResponse;
import com.eternallight.backend.application.service.WorkActDismantledEquipmentService;
import com.eternallight.backend.infrastructure.db.entity.WorkActDismantledEquipmentEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/dismantled-equipment")
public class WorkActDismantledEquipmentController {

    private final WorkActDismantledEquipmentService service;

    public WorkActDismantledEquipmentController(WorkActDismantledEquipmentService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActDismantledEquipmentResponse create(
            @PathVariable Long workActId,
            @Valid @RequestBody UpsertWorkActDismantledEquipmentRequest r
    ) {
        return toResponse(service.create(workActId, r));
    }

    @GetMapping
    public List<WorkActDismantledEquipmentResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public WorkActDismantledEquipmentResponse get(@PathVariable Long workActId, @PathVariable Long id) {
        return toResponse(service.get(workActId, id));
    }

    @PutMapping("/{id}")
    public WorkActDismantledEquipmentResponse update(
            @PathVariable Long workActId,
            @PathVariable Long id,
            @Valid @RequestBody UpsertWorkActDismantledEquipmentRequest r
    ) {
        return toResponse(service.update(workActId, id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long workActId, @PathVariable Long id) {
        service.delete(workActId, id);
    }

    private WorkActDismantledEquipmentResponse toResponse(WorkActDismantledEquipmentEntity e) {
        return new WorkActDismantledEquipmentResponse(
                e.getId(),
                e.getWorkActId(),
                e.getSeq(),
                e.getName(),
                e.getModel(),
                e.getSerialNumber(),
                e.getManufactureYear(),
                e.getQuantity(),
                e.getEquipmentConditionId(),
                e.getStorageOrTransferPlace()
        );
    }
}

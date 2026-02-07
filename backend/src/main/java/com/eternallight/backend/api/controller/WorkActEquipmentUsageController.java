package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActEquipmentUsageRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActEquipmentUsageRequest;
import com.eternallight.backend.api.dto.response.WorkActEquipmentUsageResponse;
import com.eternallight.backend.api.mapper.WorkActEquipmentUsageApiMapper;
import com.eternallight.backend.application.service.WorkActEquipmentUsageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/equipment-usage")
public class WorkActEquipmentUsageController {

    private final WorkActEquipmentUsageService service;

    public WorkActEquipmentUsageController(WorkActEquipmentUsageService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActEquipmentUsageResponse add(@PathVariable Long workActId, @Valid @RequestBody AddWorkActEquipmentUsageRequest r) {
        return WorkActEquipmentUsageApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActEquipmentUsageResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActEquipmentUsageApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public WorkActEquipmentUsageResponse get(@PathVariable Long workActId, @PathVariable Long id) {
        return WorkActEquipmentUsageApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public WorkActEquipmentUsageResponse update(@PathVariable Long workActId, @PathVariable Long id, @RequestBody UpdateWorkActEquipmentUsageRequest r) {
        return WorkActEquipmentUsageApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long workActId, @PathVariable Long id) {
        service.delete(id);
    }
}

package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActLaborItemRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActLaborItemRequest;
import com.eternallight.backend.api.dto.response.WorkActLaborItemResponse;
import com.eternallight.backend.api.mapper.WorkActLaborItemApiMapper;
import com.eternallight.backend.application.service.WorkActLaborItemService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/labor-items")
public class WorkActLaborItemController {

    private final WorkActLaborItemService service;

    public WorkActLaborItemController(WorkActLaborItemService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActLaborItemResponse add(@PathVariable Long workActId, @Valid @RequestBody AddWorkActLaborItemRequest r) {
        return WorkActLaborItemApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActLaborItemResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActLaborItemApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public WorkActLaborItemResponse get(@PathVariable Long workActId, @PathVariable Long id) {
        return WorkActLaborItemApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public WorkActLaborItemResponse update(@PathVariable Long workActId, @PathVariable Long id, @RequestBody UpdateWorkActLaborItemRequest r) {
        return WorkActLaborItemApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long workActId, @PathVariable Long id) {
        service.delete(id);
    }
}

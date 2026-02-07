package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActMaterialRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActMaterialRequest;
import com.eternallight.backend.api.dto.response.WorkActMaterialResponse;
import com.eternallight.backend.api.mapper.WorkActMaterialApiMapper;
import com.eternallight.backend.application.service.WorkActMaterialService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/materials")
public class WorkActMaterialController {

    private final WorkActMaterialService service;

    public WorkActMaterialController(WorkActMaterialService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActMaterialResponse add(@PathVariable Long workActId, @Valid @RequestBody AddWorkActMaterialRequest r) {
        return WorkActMaterialApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActMaterialResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActMaterialApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public WorkActMaterialResponse get(@PathVariable Long workActId, @PathVariable Long id) {
        return WorkActMaterialApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public WorkActMaterialResponse update(@PathVariable Long workActId, @PathVariable Long id, @RequestBody UpdateWorkActMaterialRequest r) {
        return WorkActMaterialApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long workActId, @PathVariable Long id) {
        service.delete(id);
    }
}

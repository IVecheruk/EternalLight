package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActPerformedWorkRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActPerformedWorkRequest;
import com.eternallight.backend.api.dto.response.WorkActPerformedWorkResponse;
import com.eternallight.backend.api.mapper.WorkActPerformedWorkApiMapper;
import com.eternallight.backend.application.service.WorkActPerformedWorkService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/performed-works")
public class WorkActPerformedWorkController {

    private final WorkActPerformedWorkService service;

    public WorkActPerformedWorkController(WorkActPerformedWorkService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActPerformedWorkResponse add(
            @PathVariable Long workActId,
            @Valid @RequestBody AddWorkActPerformedWorkRequest r
    ) {
        return WorkActPerformedWorkApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActPerformedWorkResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActPerformedWorkApiMapper::toResponse).toList();
    }

    /**
     * GET по id строки (не по workActId+seq, потому что у строки есть PK)
     */
    @GetMapping("/{id}")
    public WorkActPerformedWorkResponse get(@PathVariable Long workActId, @PathVariable Long id) {
        // workActId оставлен в URL для иерархии
        return WorkActPerformedWorkApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public WorkActPerformedWorkResponse update(
            @PathVariable Long workActId,
            @PathVariable Long id,
            @RequestBody UpdateWorkActPerformedWorkRequest r
    ) {
        return WorkActPerformedWorkApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long workActId, @PathVariable Long id) {
        service.delete(id);
    }
}

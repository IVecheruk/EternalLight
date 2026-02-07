package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActFaultRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActFaultRequest;
import com.eternallight.backend.api.dto.response.WorkActFaultResponse;
import com.eternallight.backend.api.mapper.WorkActFaultApiMapper;
import com.eternallight.backend.application.service.WorkActFaultService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/faults")
public class WorkActFaultController {

    private final WorkActFaultService service;

    public WorkActFaultController(WorkActFaultService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActFaultResponse add(@PathVariable Long workActId, @Valid @RequestBody AddWorkActFaultRequest r) {
        return WorkActFaultApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActFaultResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActFaultApiMapper::toResponse).toList();
    }

    @PutMapping("/{faultTypeId}")
    public WorkActFaultResponse update(
            @PathVariable Long workActId,
            @PathVariable Long faultTypeId,
            @RequestBody UpdateWorkActFaultRequest r
    ) {
        return WorkActFaultApiMapper.toResponse(service.update(workActId, faultTypeId, r));
    }

    @DeleteMapping("/{faultTypeId}")
    public void delete(@PathVariable Long workActId, @PathVariable Long faultTypeId) {
        service.delete(workActId, faultTypeId);
    }
}

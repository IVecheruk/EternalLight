package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActBasisRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActBasisRequest;
import com.eternallight.backend.api.dto.response.WorkActBasisResponse;
import com.eternallight.backend.api.mapper.WorkActBasisApiMapper;
import com.eternallight.backend.application.service.WorkActBasisService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/basis")
public class WorkActBasisController {

    private final WorkActBasisService service;

    public WorkActBasisController(WorkActBasisService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActBasisResponse add(@PathVariable Long workActId, @Valid @RequestBody AddWorkActBasisRequest r) {
        return WorkActBasisApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActBasisResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActBasisApiMapper::toResponse).toList();
    }

    @PutMapping("/{workBasisTypeId}")
    public WorkActBasisResponse update(
            @PathVariable Long workActId,
            @PathVariable Long workBasisTypeId,
            @RequestBody UpdateWorkActBasisRequest r
    ) {
        return WorkActBasisApiMapper.toResponse(service.update(workActId, workBasisTypeId, r));
    }

    @DeleteMapping("/{workBasisTypeId}")
    public void delete(@PathVariable Long workActId, @PathVariable Long workBasisTypeId) {
        service.delete(workActId, workBasisTypeId);
    }
}

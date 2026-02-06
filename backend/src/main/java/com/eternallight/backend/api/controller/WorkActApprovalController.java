package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.UpsertWorkActApprovalRequest;
import com.eternallight.backend.api.dto.response.WorkActApprovalResponse;
import com.eternallight.backend.api.mapper.WorkActApprovalApiMapper;
import com.eternallight.backend.application.service.WorkActApprovalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/approval")
public class WorkActApprovalController {

    private final WorkActApprovalService service;

    public WorkActApprovalController(WorkActApprovalService service) {
        this.service = service;
    }

    /**
     * UPSERT (создать/обновить)
     */
    @PutMapping
    public WorkActApprovalResponse upsert(
            @PathVariable Long workActId,
            @Valid @RequestBody UpsertWorkActApprovalRequest request
    ) {
        return WorkActApprovalApiMapper.toResponse(service.upsert(workActId, request));
    }

    /**
     * GET approval
     */
    @GetMapping
    public WorkActApprovalResponse get(@PathVariable Long workActId) {
        return WorkActApprovalApiMapper.toResponse(service.get(workActId));
    }

    /**
     * DELETE approval
     */
    @DeleteMapping
    public void delete(@PathVariable Long workActId) {
        service.delete(workActId);
    }
}

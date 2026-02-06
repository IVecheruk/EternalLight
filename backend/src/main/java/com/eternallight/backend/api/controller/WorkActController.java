package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateWorkActRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActRequest;
import com.eternallight.backend.api.dto.response.WorkActResponse;
import com.eternallight.backend.api.mapper.WorkActApiMapper;
import com.eternallight.backend.application.service.WorkActService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/work-acts")
public class WorkActController {

    private final WorkActService service;

    public WorkActController(WorkActService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActResponse create(@Valid @RequestBody CreateWorkActRequest request) {
        return WorkActApiMapper.toResponse(service.create(request));
    }

    /**
     * Примеры:
     * GET /api/v1/work-acts
     * GET /api/v1/work-acts?executorOrgId=1
     * GET /api/v1/work-acts?lightingObjectId=2
     * GET /api/v1/work-acts?executorOrgId=1&lightingObjectId=2
     * GET /api/v1/work-acts?actNumber=2026
     *
     * Пагинация/сортировка:
     * GET ...?page=0&size=20&sort=id,desc
     */
    @GetMapping
    public Page<WorkActResponse> list(
            @RequestParam(required = false) Long executorOrgId,
            @RequestParam(required = false) Long lightingObjectId,
            @RequestParam(required = false) String actNumber,
            Pageable pageable
    ) {
        return service.list(executorOrgId, lightingObjectId, actNumber, pageable)
                .map(WorkActApiMapper::toResponse);
    }

    @GetMapping("/{id}")
    public WorkActResponse get(@PathVariable Long id) {
        return WorkActApiMapper.toResponse(service.getById(id));
    }

    @PutMapping("/{id}")
    public WorkActResponse update(@PathVariable Long id, @Valid @RequestBody UpdateWorkActRequest request) {
        return WorkActApiMapper.toResponse(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

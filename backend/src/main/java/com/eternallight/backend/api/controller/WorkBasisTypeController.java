package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateWorkBasisTypeRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkBasisTypeRequest;
import com.eternallight.backend.api.dto.response.WorkBasisTypeResponse;
import com.eternallight.backend.api.mapper.WorkBasisTypeApiMapper;
import com.eternallight.backend.application.service.WorkBasisTypeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-basis-types")
public class WorkBasisTypeController {

    private final WorkBasisTypeService service;

    public WorkBasisTypeController(WorkBasisTypeService service) {
        this.service = service;
    }

    @PostMapping
    public WorkBasisTypeResponse create(@Valid @RequestBody CreateWorkBasisTypeRequest r) {
        return WorkBasisTypeApiMapper.toResponse(service.create(r));
    }

    @GetMapping
    public List<WorkBasisTypeResponse> list() {
        return service.list().stream().map(WorkBasisTypeApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public WorkBasisTypeResponse get(@PathVariable Long id) {
        return WorkBasisTypeApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public WorkBasisTypeResponse update(@PathVariable Long id, @Valid @RequestBody UpdateWorkBasisTypeRequest r) {
        return WorkBasisTypeApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

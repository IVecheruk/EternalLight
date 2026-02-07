package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateFaultTypeRequest;
import com.eternallight.backend.api.dto.request.UpdateFaultTypeRequest;
import com.eternallight.backend.api.dto.response.FaultTypeResponse;
import com.eternallight.backend.api.mapper.FaultTypeApiMapper;
import com.eternallight.backend.application.service.FaultTypeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fault-types")
public class FaultTypeController {

    private final FaultTypeService service;

    public FaultTypeController(FaultTypeService service) {
        this.service = service;
    }

    @PostMapping
    public FaultTypeResponse create(@Valid @RequestBody CreateFaultTypeRequest r) {
        return FaultTypeApiMapper.toResponse(service.create(r));
    }

    @GetMapping
    public List<FaultTypeResponse> list() {
        return service.list().stream().map(FaultTypeApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public FaultTypeResponse get(@PathVariable Long id) {
        return FaultTypeApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public FaultTypeResponse update(@PathVariable Long id, @Valid @RequestBody UpdateFaultTypeRequest r) {
        return FaultTypeApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

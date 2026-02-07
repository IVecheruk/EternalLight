package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateUnitOfMeasureRequest;
import com.eternallight.backend.api.dto.request.UpdateUnitOfMeasureRequest;
import com.eternallight.backend.api.dto.response.UnitOfMeasureResponse;
import com.eternallight.backend.api.mapper.UnitOfMeasureApiMapper;
import com.eternallight.backend.application.service.UnitOfMeasureService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/uoms")
public class UnitOfMeasureController {

    private final UnitOfMeasureService service;

    public UnitOfMeasureController(UnitOfMeasureService service) {
        this.service = service;
    }

    @PostMapping
    public UnitOfMeasureResponse create(@Valid @RequestBody CreateUnitOfMeasureRequest r) {
        return UnitOfMeasureApiMapper.toResponse(service.create(r));
    }

    @GetMapping
    public List<UnitOfMeasureResponse> list() {
        return service.list().stream().map(UnitOfMeasureApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public UnitOfMeasureResponse get(@PathVariable Long id) {
        return UnitOfMeasureApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public UnitOfMeasureResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUnitOfMeasureRequest r) {
        return UnitOfMeasureApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateLightingObjectRequest;
import com.eternallight.backend.api.dto.request.UpdateLightingObjectRequest;
import com.eternallight.backend.api.dto.response.LightingObjectResponse;
import com.eternallight.backend.api.mapper.LightingObjectApiMapper;
import com.eternallight.backend.application.service.LightingObjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lighting-objects")
public class LightingObjectController {

    private final LightingObjectService service;

    public LightingObjectController(LightingObjectService service) {
        this.service = service;
    }

    @PostMapping
    public LightingObjectResponse create(@Valid @RequestBody CreateLightingObjectRequest request) {
        return LightingObjectApiMapper.toResponse(service.create(request));
    }

    @GetMapping
    public List<LightingObjectResponse> list() {
        return service.list().stream()
                .map(LightingObjectApiMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public LightingObjectResponse get(@PathVariable Long id) {
        return LightingObjectApiMapper.toResponse(service.getById(id));
    }

    @PutMapping("/{id}")
    public LightingObjectResponse update(@PathVariable Long id,
                                         @Valid @RequestBody UpdateLightingObjectRequest request) {
        return LightingObjectApiMapper.toResponse(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

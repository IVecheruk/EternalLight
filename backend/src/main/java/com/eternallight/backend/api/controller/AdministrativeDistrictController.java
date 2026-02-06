package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateAdministrativeDistrictRequest;
import com.eternallight.backend.api.dto.request.UpdateAdministrativeDistrictRequest;
import com.eternallight.backend.api.dto.response.AdministrativeDistrictResponse;
import com.eternallight.backend.api.mapper.AdministrativeDistrictApiMapper;
import com.eternallight.backend.application.service.AdministrativeDistrictService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/administrative-districts")
public class AdministrativeDistrictController {

    private final AdministrativeDistrictService service;

    public AdministrativeDistrictController(AdministrativeDistrictService service) {
        this.service = service;
    }

    @PostMapping
    public AdministrativeDistrictResponse create(
            @Valid @RequestBody CreateAdministrativeDistrictRequest request
            ) {
        return AdministrativeDistrictApiMapper
                .toResponse(service.create(request.name()));
    }

    @GetMapping
    public List<AdministrativeDistrictResponse> list() {
        return service
                .list()
                .stream()
                .map(AdministrativeDistrictApiMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public AdministrativeDistrictResponse get(
            @PathVariable Long id
    ) {
        return AdministrativeDistrictApiMapper.toResponse(service.getById(id));
    }

    @PutMapping("/{id}")
    public AdministrativeDistrictResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdministrativeDistrictRequest request
            ) {
        return AdministrativeDistrictApiMapper.toResponse(service.update(id, request.name()));
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        service.delete(id);
    }
}
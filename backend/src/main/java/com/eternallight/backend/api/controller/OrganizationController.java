package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateOrganizationRequest;
import com.eternallight.backend.api.dto.request.UpdateOrganizationRequest;
import com.eternallight.backend.api.dto.response.OrganizationResponse;
import com.eternallight.backend.api.mapper.OrganizationApiMapper;
import com.eternallight.backend.application.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizations")
public class OrganizationController {

    private final OrganizationService service;

    public OrganizationController(OrganizationService service) {
        this.service = service;
    }

    @PostMapping
    public OrganizationResponse create(
            @Valid @RequestBody CreateOrganizationRequest request
            ) {
        var org = service.create(request.fullName(), request.city());
        return OrganizationApiMapper.toResponse(org);
    }

    @GetMapping("/{id}")
    public OrganizationResponse get(
            @PathVariable Long id
    ) {
        return OrganizationApiMapper
                .toResponse(service.getById(id));
    }

    @GetMapping
    public List<OrganizationResponse> list(){
        return service.list().stream()
                .map(OrganizationApiMapper::toResponse)
                .toList();
    }

    @PutMapping("/{id}")
    public OrganizationResponse update(@PathVariable Long id,
                                       @Valid @RequestBody UpdateOrganizationRequest request) {
        return OrganizationApiMapper.toResponse(service.update(id, request.fullName(), request.city()));
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        service.delete(id);
    }
}
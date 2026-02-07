package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateBrigadeRoleRequest;
import com.eternallight.backend.api.dto.request.UpdateBrigadeRoleRequest;
import com.eternallight.backend.api.dto.response.BrigadeRoleResponse;
import com.eternallight.backend.api.mapper.BrigadeRoleApiMapper;
import com.eternallight.backend.application.service.BrigadeRoleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brigade-roles")
public class BrigadeRoleController {

    private final BrigadeRoleService service;

    public BrigadeRoleController(BrigadeRoleService service) {
        this.service = service;
    }

    @PostMapping
    public BrigadeRoleResponse create(@Valid @RequestBody CreateBrigadeRoleRequest r) {
        return BrigadeRoleApiMapper.toResponse(service.create(r));
    }

    @GetMapping
    public List<BrigadeRoleResponse> list() {
        return service.list().stream().map(BrigadeRoleApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public BrigadeRoleResponse get(@PathVariable Long id) {
        return BrigadeRoleApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public BrigadeRoleResponse update(@PathVariable Long id, @Valid @RequestBody UpdateBrigadeRoleRequest r) {
        return BrigadeRoleApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

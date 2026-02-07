package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateEquipmentConditionRequest;
import com.eternallight.backend.api.dto.response.EquipmentConditionResponse;
import com.eternallight.backend.application.service.EquipmentConditionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/equipment-conditions")
public class EquipmentConditionController {

    private final EquipmentConditionService service;

    public EquipmentConditionController(EquipmentConditionService service) {
        this.service = service;
    }

    @PostMapping
    public EquipmentConditionResponse create(@Valid @RequestBody CreateEquipmentConditionRequest r) {
        var e = service.create(r.code(), r.name());
        return new EquipmentConditionResponse(e.getId(), e.getCode(), e.getName());
    }

    @GetMapping
    public List<EquipmentConditionResponse> list() {
        return service.list().stream()
                .map(e -> new EquipmentConditionResponse(e.getId(), e.getCode(), e.getName()))
                .toList();
    }
}

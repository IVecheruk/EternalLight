package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateStreetRequest;
import com.eternallight.backend.api.dto.request.UpdateStreetRequest;
import com.eternallight.backend.api.dto.response.StreetResponse;
import com.eternallight.backend.api.mapper.StreetApiMapper;
import com.eternallight.backend.application.service.StreetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/streets")
public class StreetController {

    private final StreetService service;

    public StreetController(StreetService service) {
        this.service = service;
    }

    @PostMapping
    public StreetResponse create(@Valid @RequestBody CreateStreetRequest request) {
        return StreetApiMapper.toResponse(service.create(request.name()));
    }

    @GetMapping
    public List<StreetResponse> list() {
        return service.list().stream()
                .map(StreetApiMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public StreetResponse get(@PathVariable Long id) {
        return StreetApiMapper.toResponse(service.getById(id));
    }

    @PutMapping("/{id}")
    public StreetResponse update(@PathVariable Long id,
                                 @Valid @RequestBody UpdateStreetRequest request) {
        return StreetApiMapper.toResponse(service.update(id, request.name()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

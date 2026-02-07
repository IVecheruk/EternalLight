package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.CreateEmployeeRequest;
import com.eternallight.backend.api.dto.request.UpdateEmployeeRequest;
import com.eternallight.backend.api.dto.response.EmployeeResponse;
import com.eternallight.backend.api.mapper.EmployeeApiMapper;
import com.eternallight.backend.application.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @PostMapping
    public EmployeeResponse create(@Valid @RequestBody CreateEmployeeRequest r) {
        return EmployeeApiMapper.toResponse(service.create(r));
    }

    @GetMapping
    public List<EmployeeResponse> list() {
        return service.list().stream().map(EmployeeApiMapper::toResponse).toList();
    }

    @GetMapping("/{id}")
    public EmployeeResponse get(@PathVariable Long id) {
        return EmployeeApiMapper.toResponse(service.get(id));
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequest r) {
        return EmployeeApiMapper.toResponse(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

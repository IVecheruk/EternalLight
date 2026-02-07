package com.eternallight.backend.api.controller;

import com.eternallight.backend.api.dto.request.AddWorkActBrigadeMemberRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActBrigadeMemberRequest;
import com.eternallight.backend.api.dto.response.WorkActBrigadeMemberResponse;
import com.eternallight.backend.api.mapper.WorkActBrigadeMemberApiMapper;
import com.eternallight.backend.application.service.WorkActBrigadeMemberService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/work-acts/{workActId}/brigade")
public class WorkActBrigadeMemberController {

    private final WorkActBrigadeMemberService service;

    public WorkActBrigadeMemberController(WorkActBrigadeMemberService service) {
        this.service = service;
    }

    @PostMapping
    public WorkActBrigadeMemberResponse add(
            @PathVariable Long workActId,
            @Valid @RequestBody AddWorkActBrigadeMemberRequest r
    ) {
        return WorkActBrigadeMemberApiMapper.toResponse(service.add(workActId, r));
    }

    @GetMapping
    public List<WorkActBrigadeMemberResponse> list(@PathVariable Long workActId) {
        return service.list(workActId).stream().map(WorkActBrigadeMemberApiMapper::toResponse).toList();
    }

    /**
     * update по memberId (удобно: это PK строки)
     */
    @PutMapping("/{memberId}")
    public WorkActBrigadeMemberResponse update(
            @PathVariable Long workActId,
            @PathVariable Long memberId,
            @RequestBody UpdateWorkActBrigadeMemberRequest r
    ) {
        // workActId тут в URL для красивой иерархии, но обновляем по memberId.
        return WorkActBrigadeMemberApiMapper.toResponse(service.update(memberId, r));
    }

    @DeleteMapping("/{memberId}")
    public void delete(@PathVariable Long workActId, @PathVariable Long memberId) {
        service.delete(memberId);
    }
}

package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActBrigadeMemberRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActBrigadeMemberRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActBrigadeMember;
import com.eternallight.backend.infrastructure.db.entity.WorkActBrigadeMemberEntity;
import com.eternallight.backend.infrastructure.db.repository.BrigadeRoleRepository;
import com.eternallight.backend.infrastructure.db.repository.EmployeeRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActBrigadeMemberRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActBrigadeMemberService {

    private final WorkActBrigadeMemberRepository repo;
    private final WorkActRepository workActRepository;
    private final EmployeeRepository employeeRepository;
    private final BrigadeRoleRepository brigadeRoleRepository;

    public WorkActBrigadeMemberService(
            WorkActBrigadeMemberRepository repo,
            WorkActRepository workActRepository,
            EmployeeRepository employeeRepository,
            BrigadeRoleRepository brigadeRoleRepository
    ) {
        this.repo = repo;
        this.workActRepository = workActRepository;
        this.employeeRepository = employeeRepository;
        this.brigadeRoleRepository = brigadeRoleRepository;
    }

    @Transactional
    public WorkActBrigadeMember add(Long workActId, AddWorkActBrigadeMemberRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        if (!employeeRepository.existsById(r.employeeId())) {
            throw new NotFoundException("Employee not found: id=" + r.employeeId());
        }
        if (!brigadeRoleRepository.existsById(r.brigadeRoleId())) {
            throw new NotFoundException("Brigade role not found: id=" + r.brigadeRoleId());
        }

        WorkActBrigadeMemberEntity e = new WorkActBrigadeMemberEntity(
                workActId,
                r.employeeId(),
                r.brigadeRoleId(),
                r.seq()
        );

        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public List<WorkActBrigadeMember> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return repo.findAllByWorkActIdOrderBySeqAsc(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional
    public WorkActBrigadeMember update(Long memberId, UpdateWorkActBrigadeMemberRequest r) {
        WorkActBrigadeMemberEntity e = repo.findById(memberId)
                .orElseThrow(() -> new NotFoundException("Work act brigade member not found: id=" + memberId));

        if (r.brigadeRoleId() != null) {
            if (!brigadeRoleRepository.existsById(r.brigadeRoleId())) {
                throw new NotFoundException("Brigade role not found: id=" + r.brigadeRoleId());
            }
            e.setBrigadeRoleId(r.brigadeRoleId());
        }
        if (r.seq() != null) {
            e.setSeq(r.seq());
        }

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long memberId) {
        if (!repo.existsById(memberId)) {
            throw new NotFoundException("Work act brigade member not found: id=" + memberId);
        }
        repo.deleteById(memberId);
    }

    private WorkActBrigadeMember toDomain(WorkActBrigadeMemberEntity e) {
        return new WorkActBrigadeMember(e.getId(), e.getWorkActId(), e.getEmployeeId(), e.getBrigadeRoleId(), e.getSeq());
    }
}

package com.eternallight.backend.application.service;

import com.eternallight.backend.api.dto.request.AddWorkActPerformedWorkRequest;
import com.eternallight.backend.api.dto.request.UpdateWorkActPerformedWorkRequest;
import com.eternallight.backend.domain.exception.NotFoundException;
import com.eternallight.backend.domain.model.WorkActPerformedWork;
import com.eternallight.backend.infrastructure.db.entity.WorkActPerformedWorkEntity;
import com.eternallight.backend.infrastructure.db.repository.WorkActPerformedWorkRepository;
import com.eternallight.backend.infrastructure.db.repository.WorkActRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkActPerformedWorkService {

    private final WorkActPerformedWorkRepository repo;
    private final WorkActRepository workActRepository;

    public WorkActPerformedWorkService(
            WorkActPerformedWorkRepository repo,
            WorkActRepository workActRepository
    ) {
        this.repo = repo;
        this.workActRepository = workActRepository;
    }

    @Transactional
    public WorkActPerformedWork add(Long workActId, AddWorkActPerformedWorkRequest r) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }

        WorkActPerformedWorkEntity e = new WorkActPerformedWorkEntity(
                workActId,
                r.seq(),
                r.description().trim()
        );

        return toDomain(repo.save(e));
    }

    @Transactional(readOnly = true)
    public List<WorkActPerformedWork> list(Long workActId) {
        if (!workActRepository.existsById(workActId)) {
            throw new NotFoundException("Work act not found: id=" + workActId);
        }
        return repo.findAllByWorkActIdOrderBySeqAsc(workActId).stream().map(this::toDomain).toList();
    }

    @Transactional(readOnly = true)
    public WorkActPerformedWork get(Long id) {
        return repo.findById(id).map(this::toDomain)
                .orElseThrow(() -> new NotFoundException("Performed work not found: id=" + id));
    }

    @Transactional
    public WorkActPerformedWork update(Long id, UpdateWorkActPerformedWorkRequest r) {
        WorkActPerformedWorkEntity e = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Performed work not found: id=" + id));

        if (r.seq() != null) e.setSeq(r.seq());
        if (r.description() != null) e.setDescription(r.description().trim());

        return toDomain(repo.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Performed work not found: id=" + id);
        }
        repo.deleteById(id);
    }

    private WorkActPerformedWork toDomain(WorkActPerformedWorkEntity e) {
        return new WorkActPerformedWork(e.getId(), e.getWorkActId(), e.getSeq(), e.getDescription());
    }
}

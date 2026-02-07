package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActPerformedWorkEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkActPerformedWorkRepository extends JpaRepository<WorkActPerformedWorkEntity, Long> {
    List<WorkActPerformedWorkEntity> findAllByWorkActIdOrderBySeqAsc(Long workActId);
}

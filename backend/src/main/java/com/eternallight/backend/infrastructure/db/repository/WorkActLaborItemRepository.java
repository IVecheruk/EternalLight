package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActLaborItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkActLaborItemRepository extends JpaRepository<WorkActLaborItemEntity, Long> {
    List<WorkActLaborItemEntity> findAllByWorkActIdOrderBySeqAsc(Long workActId);
}

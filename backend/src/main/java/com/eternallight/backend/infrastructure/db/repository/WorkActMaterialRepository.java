package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActMaterialEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkActMaterialRepository extends JpaRepository<WorkActMaterialEntity, Long> {
    List<WorkActMaterialEntity> findAllByWorkActIdOrderBySeqAsc(Long workActId);
}

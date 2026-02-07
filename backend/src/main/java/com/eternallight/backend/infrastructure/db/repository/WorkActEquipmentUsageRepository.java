package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActEquipmentUsageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkActEquipmentUsageRepository extends JpaRepository<WorkActEquipmentUsageEntity, Long> {
    List<WorkActEquipmentUsageEntity> findAllByWorkActIdOrderBySeqAsc(Long workActId);
}

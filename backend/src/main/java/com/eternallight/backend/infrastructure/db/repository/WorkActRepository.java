package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkActRepository extends JpaRepository<WorkActEntity, Long> {

    Page<WorkActEntity> findAllByExecutorOrgId(Long executorOrgId, Pageable pageable);

    Page<WorkActEntity> findAllByLightingObjectId(Long lightingObjectId, Pageable pageable);

    Page<WorkActEntity> findAllByExecutorOrgIdAndLightingObjectId(Long executorOrgId, Long lightingObjectId, Pageable pageable);

    Page<WorkActEntity> findAllByActNumberContainingIgnoreCase(String actNumber, Pageable pageable);
}

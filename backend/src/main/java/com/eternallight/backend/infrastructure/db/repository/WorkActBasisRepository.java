package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActBasisEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkActBasisRepository extends JpaRepository<WorkActBasisEntity, Long> {
    List<WorkActBasisEntity> findAllByWorkActId(Long workActId);
    Optional<WorkActBasisEntity> findByWorkActIdAndWorkBasisTypeId(Long workActId, Long workBasisTypeId);
    boolean existsByWorkActIdAndWorkBasisTypeId(Long workActId, Long workBasisTypeId);
}

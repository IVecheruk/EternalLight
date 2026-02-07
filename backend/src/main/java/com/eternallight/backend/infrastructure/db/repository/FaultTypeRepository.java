package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.FaultTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaultTypeRepository extends JpaRepository<FaultTypeEntity, Long> {
    boolean existsByCode(String code);
}

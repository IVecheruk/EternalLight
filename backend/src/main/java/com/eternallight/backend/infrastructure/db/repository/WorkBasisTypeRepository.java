package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkBasisTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkBasisTypeRepository extends JpaRepository<WorkBasisTypeEntity, Long> {
    Optional<WorkBasisTypeEntity> findByCode(String code);
    boolean existsByCode(String code);
}

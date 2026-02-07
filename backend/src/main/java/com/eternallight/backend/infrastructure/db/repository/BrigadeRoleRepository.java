package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.BrigadeRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrigadeRoleRepository extends JpaRepository<BrigadeRoleEntity, Long> {
    boolean existsByCode(String code);
}

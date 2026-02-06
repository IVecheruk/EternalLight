package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.StreetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreetRepository extends JpaRepository<StreetEntity, Long> {
    boolean existsByNameIgnoreCase(String name);
}

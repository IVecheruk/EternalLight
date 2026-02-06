package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.LightingObjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LightingObjectRepository extends JpaRepository<LightingObjectEntity, Long> {}

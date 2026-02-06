package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.AdministrativeDistrictEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministrativeDistrictRepository extends JpaRepository<AdministrativeDistrictEntity, Long> {
    boolean existsByNameIgnoreCase(String name);
}

package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActApprovalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkActApprovalRepository extends JpaRepository<WorkActApprovalEntity, Long> {}

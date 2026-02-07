package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActFaultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkActFaultRepository extends JpaRepository<WorkActFaultEntity, Long> {

    List<WorkActFaultEntity> findAllByWorkActId(Long workActId);

    Optional<WorkActFaultEntity> findByWorkActIdAndFaultTypeId(Long workActId, Long faultTypeId);
}

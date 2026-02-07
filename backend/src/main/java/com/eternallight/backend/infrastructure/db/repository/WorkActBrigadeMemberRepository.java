package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActBrigadeMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkActBrigadeMemberRepository extends JpaRepository<WorkActBrigadeMemberEntity, Long> {
    List<WorkActBrigadeMemberEntity> findAllByWorkActIdOrderBySeqAsc(Long workActId);
}

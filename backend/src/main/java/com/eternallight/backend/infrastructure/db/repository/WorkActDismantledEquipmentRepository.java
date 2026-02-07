package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActDismantledEquipmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkActDismantledEquipmentRepository extends JpaRepository<WorkActDismantledEquipmentEntity, Long> {

    List<WorkActDismantledEquipmentEntity> findAllByWorkActIdOrderBySeqAscIdAsc(Long workActId);

    Optional<WorkActDismantledEquipmentEntity> findByIdAndWorkActId(Long id, Long workActId);

    boolean existsByIdAndWorkActId(Long id, Long workActId);

    void deleteByIdAndWorkActId(Long id, Long workActId);
}

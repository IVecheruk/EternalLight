package com.eternallight.backend.infrastructure.db.repository;

import com.eternallight.backend.infrastructure.db.entity.WorkActInstalledEquipmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkActInstalledEquipmentRepository extends JpaRepository<WorkActInstalledEquipmentEntity, Long> {

    List<WorkActInstalledEquipmentEntity> findAllByWorkActIdOrderBySeqAscIdAsc(Long workActId);

    Optional<WorkActInstalledEquipmentEntity> findByIdAndWorkActId(Long id, Long workActId);

    boolean existsByIdAndWorkActId(Long id, Long workActId);

    void deleteByIdAndWorkActId(Long id, Long workActId);
}

package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "work_act_fault",
        uniqueConstraints = @UniqueConstraint(name = "uk_work_act_fault_act_type", columnNames = {"work_act_id", "fault_type_id"})
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActFaultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_act_fault_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "fault_type_id", nullable = false)
    private Long faultTypeId;

    @Column(name = "is_selected", nullable = false)
    private Boolean isSelected = true;

    @Column(name = "other_text")
    private String otherText;

    public WorkActFaultEntity(Long workActId, Long faultTypeId, Boolean isSelected, String otherText) {
        this.workActId = workActId;
        this.faultTypeId = faultTypeId;
        this.isSelected = isSelected != null ? isSelected : true;
        this.otherText = otherText;
    }
}

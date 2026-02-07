package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "work_act_performed_work",
        uniqueConstraints = @UniqueConstraint(name = "uk_work_act_performed_work_act_seq", columnNames = {"work_act_id", "seq"})
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActPerformedWorkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "performed_work_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "seq", nullable = false)
    private Integer seq;

    @Column(name = "description", nullable = false)
    private String description;

    public WorkActPerformedWorkEntity(Long workActId, Integer seq, String description) {
        this.workActId = workActId;
        this.seq = seq;
        this.description = description;
    }
}

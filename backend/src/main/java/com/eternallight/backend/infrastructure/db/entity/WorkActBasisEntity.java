package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "work_act_basis",
        uniqueConstraints = @UniqueConstraint(name = "uk_work_act_basis_act_type", columnNames = {"work_act_id", "work_basis_type_id"})
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActBasisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_act_basis_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "work_basis_type_id", nullable = false)
    private Long workBasisTypeId;

    @Column(name = "is_selected", nullable = false)
    private Boolean isSelected = true;

    @Column(name = "document_number")
    private String documentNumber;

    @Column(name = "document_date")
    private LocalDate documentDate;

    public WorkActBasisEntity(
            Long workActId,
            Long workBasisTypeId,
            Boolean isSelected,
            String documentNumber,
            LocalDate documentDate
    ) {
        this.workActId = workActId;
        this.workBasisTypeId = workBasisTypeId;
        this.isSelected = isSelected != null ? isSelected : true;
        this.documentNumber = documentNumber;
        this.documentDate = documentDate;
    }
}

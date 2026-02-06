package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "work_basis_type")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkBasisTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_basis_type_id")
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    public WorkBasisTypeEntity(String code, String name) {
        this.code = code;
        this.name = name;
    }
}

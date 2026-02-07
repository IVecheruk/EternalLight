package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "fault_type")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FaultTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fault_type_id")
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "is_other", nullable = false)
    private Boolean isOther = false;

    public FaultTypeEntity(String code, String name, Boolean isOther) {
        this.code = code;
        this.name = name;
        this.isOther = isOther != null ? isOther : false;
    }
}

package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "unit_of_measure")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UnitOfMeasureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uom_id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public UnitOfMeasureEntity(String name) {
        this.name = name;
    }
}

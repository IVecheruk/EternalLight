package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "street")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StreetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "street_id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public StreetEntity(String name) {
        this.name = name;
    }
}

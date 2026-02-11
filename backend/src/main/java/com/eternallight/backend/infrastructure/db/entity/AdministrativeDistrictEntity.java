package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrative_district")
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AdministrativeDistrictEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "administrative_district_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    public AdministrativeDistrictEntity(String name) {
        this.name = name;
    }
}

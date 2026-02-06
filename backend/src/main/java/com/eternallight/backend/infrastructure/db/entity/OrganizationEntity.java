package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "organization")
public class OrganizationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "organization_id")
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "city")
    private String city;

    protected OrganizationEntity() {}

    public OrganizationEntity(String fullName, String city) {
        this.fullName = fullName;
        this.city = city;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getCity() { return city; }

    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setCity(String city) { this.city = city; }
}

package com.eternallight.backend.domain.model;

public class Organization {
    private final Long id;
    private final String fullName;
    private final String city;

    public Organization(
            Long id,
            String fullName,
            String city
    ) {
        this.id = id;
        this.fullName = fullName;
        this.city = city;
    }

    public Long getId() { return id;}
    public String getFullName() { return fullName;}
    public String getCity() { return city;}
}

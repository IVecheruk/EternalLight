package com.eternallight.backend.domain.model;

public class AdministrativeDistrict {
    private final Long id;
    private final String name;

    public AdministrativeDistrict(
            Long id,
            String name
    ) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {return id;}
    public String getName() {return name;}
}

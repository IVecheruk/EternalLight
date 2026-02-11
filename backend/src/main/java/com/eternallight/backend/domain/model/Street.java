package com.eternallight.backend.domain.model;

public class Street {

    private final Long id;
    private final String name;
    private final Long administrativeDistrictId;

    public Street(
            Long id,
            String name,
            Long administrativeDistrictId
    ) {
        this.id = id;
        this.name = name;
        this.administrativeDistrictId = administrativeDistrictId;
    }

    public Long getId() {return id;}
    public String getName() {return name;}
    public Long getAdministrativeDistrictId() {return administrativeDistrictId;}
}

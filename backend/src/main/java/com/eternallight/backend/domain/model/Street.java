package com.eternallight.backend.domain.model;

public class Street {

    private final Long id;
    private final String name;

    public Street(
            Long id,
            String name
    ) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {return id;}
    public String getName() {return name;}
}
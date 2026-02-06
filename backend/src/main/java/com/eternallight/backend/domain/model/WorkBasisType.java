package com.eternallight.backend.domain.model;

public class WorkBasisType {
    private final Long id;
    private final String code;
    private final String name;

    public WorkBasisType(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
}

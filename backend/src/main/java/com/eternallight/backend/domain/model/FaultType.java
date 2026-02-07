package com.eternallight.backend.domain.model;

public class FaultType {

    private final Long id;
    private final String code;
    private final String name;
    private final Boolean isOther;

    public FaultType(Long id, String code, String name, Boolean isOther) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.isOther = isOther;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public Boolean getIsOther() { return isOther; }
}

package com.eternallight.backend.domain.model;

public class WorkActFault {

    private final Long id;
    private final Long workActId;
    private final Long faultTypeId;
    private final Boolean isSelected;
    private final String otherText;

    public WorkActFault(Long id, Long workActId, Long faultTypeId, Boolean isSelected, String otherText) {
        this.id = id;
        this.workActId = workActId;
        this.faultTypeId = faultTypeId;
        this.isSelected = isSelected;
        this.otherText = otherText;
    }

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Long getFaultTypeId() { return faultTypeId; }
    public Boolean getIsSelected() { return isSelected; }
    public String getOtherText() { return otherText; }
}

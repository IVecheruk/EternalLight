package com.eternallight.backend.domain.model;

import java.time.LocalDate;

public class WorkActBasis {
    private final Long id;
    private final Long workActId;
    private final Long workBasisTypeId;
    private final Boolean isSelected;
    private final String documentNumber;
    private final LocalDate documentDate;

    public WorkActBasis(Long id, Long workActId, Long workBasisTypeId, Boolean isSelected, String documentNumber, LocalDate documentDate) {
        this.id = id;
        this.workActId = workActId;
        this.workBasisTypeId = workBasisTypeId;
        this.isSelected = isSelected;
        this.documentNumber = documentNumber;
        this.documentDate = documentDate;
    }

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Long getWorkBasisTypeId() { return workBasisTypeId; }
    public Boolean getIsSelected() { return isSelected; }
    public String getDocumentNumber() { return documentNumber; }
    public LocalDate getDocumentDate() { return documentDate; }
}

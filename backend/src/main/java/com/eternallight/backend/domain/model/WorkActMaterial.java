package com.eternallight.backend.domain.model;

import java.math.BigDecimal;

public class WorkActMaterial {

    private final Long id;
    private final Long workActId;
    private final Integer seq;
    private final String name;
    private final String modelOrArticle;
    private final Long uomId;
    private final BigDecimal quantity;
    private final BigDecimal unitPrice;
    private final BigDecimal lineTotal;

    public WorkActMaterial(Long id, Long workActId, Integer seq, String name, String modelOrArticle, Long uomId,
                           BigDecimal quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
        this.id = id;
        this.workActId = workActId;
        this.seq = seq;
        this.name = name;
        this.modelOrArticle = modelOrArticle;
        this.uomId = uomId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
    }

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Integer getSeq() { return seq; }
    public String getName() { return name; }
    public String getModelOrArticle() { return modelOrArticle; }
    public Long getUomId() { return uomId; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getLineTotal() { return lineTotal; }
}

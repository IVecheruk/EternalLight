package com.eternallight.backend.infrastructure.db.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "work_act_material")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkActMaterialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_line_id")
    private Long id;

    @Column(name = "work_act_id", nullable = false)
    private Long workActId;

    @Column(name = "seq")
    private Integer seq;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "model_or_article")
    private String modelOrArticle;

    @Column(name = "uom_id")
    private Long uomId;

    @Column(name = "quantity", precision = 14, scale = 3)
    private BigDecimal quantity;

    @Column(name = "unit_price", precision = 14, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "line_total", precision = 14, scale = 2)
    private BigDecimal lineTotal;

    public WorkActMaterialEntity(Long workActId, Integer seq, String name, String modelOrArticle, Long uomId,
                                 BigDecimal quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
        this.workActId = workActId;
        this.seq = seq;
        this.name = name;
        this.modelOrArticle = modelOrArticle;
        this.uomId = uomId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
    }
}

package com.eternallight.backend.domain.model;

public class WorkActPerformedWork {

    private final Long id;
    private final Long workActId;
    private final Integer seq;
    private final String description;

    public WorkActPerformedWork(Long id, Long workActId, Integer seq, String description) {
        this.id = id;
        this.workActId = workActId;
        this.seq = seq;
        this.description = description;
    }

    public Long getId() { return id; }
    public Long getWorkActId() { return workActId; }
    public Integer getSeq() { return seq; }
    public String getDescription() { return description; }
}

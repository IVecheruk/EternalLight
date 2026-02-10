export type WorkAct = {
    id: number;
    actNumber: string | null;
    actCompiledOn: string | null;
    actPlace: string | null;
    executorOrgId: number;
    structuralUnit: string | null;
    lightingObjectId: number | null;
    workStartedAt: string | null;
    workFinishedAt: string | null;
    totalDurationMinutes: number | null;
    actualWorkMinutes: number | null;
    downtimeMinutes: number | null;
    downtimeReason: string | null;
    faultDetails: string | null;
    faultCause: string | null;
    qualityRemarks: string | null;
    otherExpensesAmount: number | null;
    materialsTotalAmount: number | null;
    worksTotalAmount: number | null;
    transportTotalAmount: number | null;
    grandTotalAmount: number | null;
    grandTotalInWords: string | null;
    warrantyWorkMonths: number | null;
    warrantyWorkStart: string | null;
    warrantyWorkEnd: string | null;
    warrantyEquipmentMonths: number | null;
    warrantyTerms: string | null;
    copiesCount: number | null;
    acceptedWithoutRemarks: boolean | null;
};

export type WorkActPage = {
    content: WorkAct[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

export type WorkActUpsertRequest = Omit<WorkAct, "id">;

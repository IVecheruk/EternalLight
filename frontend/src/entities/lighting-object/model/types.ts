export type LightingObject = {
    id: number;
    administrativeDistrictId: number;
    streetId: number;
    houseLandmark: string | null;
    gpsLatitude: number | null;
    gpsLongitude: number | null;
    outdoorLineNumber: string | null;
    controlCabinetNumber: string | null;
    poleNumber: string | null;
    luminaireNumber: string | null;
    equipmentInventoryNumber: string | null;
};

export type LightingObjectUpsertRequest = Omit<LightingObject, "id">;

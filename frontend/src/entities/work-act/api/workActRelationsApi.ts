import { http } from "@/shared/api/http";

type IdEntity = { id: number } & Record<string, unknown>;
type Entity = Record<string, unknown>;

type NestedResourceApi = {
    list: (workActId: number) => Promise<Entity[]>;
    get: (workActId: number, id: number) => Promise<Entity>;
    create: (workActId: number, data: Entity) => Promise<Entity>;
    update: (workActId: number, id: number, data: Entity) => Promise<Entity>;
    remove: (workActId: number, id: number) => Promise<void>;
};

function createNestedCrud(baseSuffix: string): NestedResourceApi {
    return {
        list: (workActId) => http<Entity[]>(`/api/v1/work-acts/${workActId}/${baseSuffix}`, { auth: true }),
        get: (workActId, id) => http<Entity>(`/api/v1/work-acts/${workActId}/${baseSuffix}/${id}`, { auth: true }),
        create: (workActId, data) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/${baseSuffix}`, {
                method: "POST",
                auth: true,
                body: JSON.stringify(data),
            }),
        update: (workActId, id, data) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/${baseSuffix}/${id}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(data),
            }),
        remove: (workActId, id) => http<void>(`/api/v1/work-acts/${workActId}/${baseSuffix}/${id}`, { method: "DELETE", auth: true }),
    };
}

export const workActRelationsApi = {
    basis: {
        list: (workActId: number) => http<Entity[]>(`/api/v1/work-acts/${workActId}/basis`, { auth: true }),
        create: (workActId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/basis`, {
                method: "POST",
                auth: true,
                body: JSON.stringify(data),
            }),
        update: (workActId: number, workBasisTypeId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/basis/${workBasisTypeId}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(data),
            }),
        remove: (workActId: number, workBasisTypeId: number) =>
            http<void>(`/api/v1/work-acts/${workActId}/basis/${workBasisTypeId}`, { method: "DELETE", auth: true }),
    },
    faults: {
        list: (workActId: number) => http<Entity[]>(`/api/v1/work-acts/${workActId}/faults`, { auth: true }),
        create: (workActId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/faults`, {
                method: "POST",
                auth: true,
                body: JSON.stringify(data),
            }),
        update: (workActId: number, faultTypeId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/faults/${faultTypeId}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(data),
            }),
        remove: (workActId: number, faultTypeId: number) =>
            http<void>(`/api/v1/work-acts/${workActId}/faults/${faultTypeId}`, { method: "DELETE", auth: true }),
    },
    brigade: {
        list: (workActId: number) => http<Entity[]>(`/api/v1/work-acts/${workActId}/brigade`, { auth: true }),
        create: (workActId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/brigade`, {
                method: "POST",
                auth: true,
                body: JSON.stringify(data),
            }),
        update: (workActId: number, memberId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/brigade/${memberId}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(data),
            }),
        remove: (workActId: number, memberId: number) =>
            http<void>(`/api/v1/work-acts/${workActId}/brigade/${memberId}`, { method: "DELETE", auth: true }),
    },
    approval: {
        get: (workActId: number) => http<Entity>(`/api/v1/work-acts/${workActId}/approval`, { auth: true }),
        upsert: (workActId: number, data: Entity) =>
            http<Entity>(`/api/v1/work-acts/${workActId}/approval`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(data),
            }),
        remove: (workActId: number) => http<void>(`/api/v1/work-acts/${workActId}/approval`, { method: "DELETE", auth: true }),
    },
    materials: createNestedCrud("materials"),
    laborItems: createNestedCrud("labor-items"),
    performedWorks: createNestedCrud("performed-works"),
    equipmentUsage: createNestedCrud("equipment-usage"),
    dismantledEquipment: createNestedCrud("dismantled-equipment"),
    installedEquipment: createNestedCrud("installed-equipment"),
};

export type { IdEntity };

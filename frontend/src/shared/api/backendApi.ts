import { http } from "@/shared/api/http";

const json = (data: unknown) => JSON.stringify(data);

const auth = { auth: true as const };

export type Id = number;
export type AnyDto = Record<string, unknown>;

export const backendApi = {
    health: () => http<{ status?: string; [key: string]: unknown }>("/api/v1/health"),

    auth: {
        register: (data: AnyDto) => http<AnyDto>("/api/v1/auth/register", { method: "POST", body: json(data) }),
        login: (data: AnyDto) => http<AnyDto>("/api/v1/auth/login", { method: "POST", body: json(data) }),
        me: () => http<AnyDto>("/api/v1/auth/me", auth),
    },

    organizations: crud("/api/v1/organizations"),
    administrativeDistricts: crud("/api/v1/administrative-districts"),
    streets: crud("/api/v1/streets"),
    lightingObjects: crud("/api/v1/lighting-objects"),
    employees: crud("/api/v1/employees"),
    brigadeRoles: crud("/api/v1/brigade-roles"),
    unitOfMeasures: crud("/api/v1/unit-of-measures"),
    faultTypes: crud("/api/v1/fault-types"),
    workBasisTypes: crud("/api/v1/work-basis-types"),

    equipmentConditions: {
        list: () => http<AnyDto[]>("/api/v1/equipment-conditions", auth),
        create: (data: AnyDto) => http<AnyDto>("/api/v1/equipment-conditions", { method: "POST", body: json(data), auth: true }),
    },

    workActs: {
        list: (query?: URLSearchParams | string) =>
            http<AnyDto>(`/api/v1/work-acts${query ? `?${typeof query === "string" ? query : query.toString()}` : ""}`, auth),
        get: (id: Id) => http<AnyDto>(`/api/v1/work-acts/${id}`, auth),
        create: (data: AnyDto) => http<AnyDto>("/api/v1/work-acts", { method: "POST", body: json(data), auth: true }),
        update: (id: Id, data: AnyDto) => http<AnyDto>(`/api/v1/work-acts/${id}`, { method: "PUT", body: json(data), auth: true }),
        remove: (id: Id) => http<void>(`/api/v1/work-acts/${id}`, { method: "DELETE", auth: true }),

        basis: workActScoped("basis"),
        approval: {
            get: (workActId: Id) => http<AnyDto>(`/api/v1/work-acts/${workActId}/approval`, auth),
            upsert: (workActId: Id, data: AnyDto) =>
                http<AnyDto>(`/api/v1/work-acts/${workActId}/approval`, { method: "PUT", body: json(data), auth: true }),
            remove: (workActId: Id) => http<void>(`/api/v1/work-acts/${workActId}/approval`, { method: "DELETE", auth: true }),
        },
        materials: workActScoped("materials", true),
        performedWorks: workActScoped("performed-works", true),
        faults: workActScoped("faults"),
        brigade: workActScoped("brigade"),
        laborItems: workActScoped("labor-items", true),
        equipmentUsage: workActScoped("equipment-usage", true),
        installedEquipment: workActScoped("installed-equipment", true),
        dismantledEquipment: workActScoped("dismantled-equipment", true),
    },
};

function crud(base: string) {
    return {
        list: () => http<AnyDto[]>(base, auth),
        get: (id: Id) => http<AnyDto>(`${base}/${id}`, auth),
        create: (data: AnyDto) => http<AnyDto>(base, { method: "POST", body: json(data), auth: true }),
        update: (id: Id, data: AnyDto) => http<AnyDto>(`${base}/${id}`, { method: "PUT", body: json(data), auth: true }),
        remove: (id: Id) => http<void>(`${base}/${id}`, { method: "DELETE", auth: true }),
    };
}

function workActScoped(segment: string, hasId = false) {
    return {
        list: (workActId: Id) => http<AnyDto[]>(`/api/v1/work-acts/${workActId}/${segment}`, auth),
        get: hasId
            ? (workActId: Id, id: Id) => http<AnyDto>(`/api/v1/work-acts/${workActId}/${segment}/${id}`, auth)
            : undefined,
        create: (workActId: Id, data: AnyDto) =>
            http<AnyDto>(`/api/v1/work-acts/${workActId}/${segment}`, { method: "POST", body: json(data), auth: true }),
        update: (workActId: Id, id: Id, data: AnyDto) =>
            http<AnyDto>(`/api/v1/work-acts/${workActId}/${segment}/${id}`, { method: "PUT", body: json(data), auth: true }),
        remove: (workActId: Id, id: Id) =>
            http<void>(`/api/v1/work-acts/${workActId}/${segment}/${id}`, { method: "DELETE", auth: true }),
    };
}

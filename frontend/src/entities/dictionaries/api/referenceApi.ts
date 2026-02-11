import { http } from "@/shared/api/http";

type Entity = Record<string, unknown>;

type CrudApi = {
    list: () => Promise<Entity[]>;
    get: (id: number) => Promise<Entity>;
    create: (data: Entity) => Promise<Entity>;
    update: (id: number, data: Entity) => Promise<Entity>;
    remove: (id: number) => Promise<void>;
};

function createCrud(baseUrl: string, options?: { readOnly?: boolean; noGetById?: boolean }): CrudApi {
    return {
        list: () => http<Entity[]>(baseUrl, { auth: true }),
        get: (id) => {
            if (options?.noGetById) throw new Error(`GET by id is not supported for ${baseUrl}`);
            return http<Entity>(`${baseUrl}/${id}`, { auth: true });
        },
        create: (data) =>
            http<Entity>(baseUrl, {
                method: "POST",
                auth: true,
                body: JSON.stringify(data),
            }),
        update: (id, data) => {
            if (options?.readOnly) throw new Error(`Update is not supported for ${baseUrl}`);
            return http<Entity>(`${baseUrl}/${id}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(data),
            });
        },
        remove: (id) => {
            if (options?.readOnly) throw new Error(`Delete is not supported for ${baseUrl}`);
            return http<void>(`${baseUrl}/${id}`, { method: "DELETE", auth: true });
        },
    };
}

export const referenceApi = {
    workBasisTypes: createCrud("/api/v1/work-basis-types"),
    brigadeRoles: createCrud("/api/v1/brigade-roles"),
    faultTypes: createCrud("/api/v1/fault-types"),
    unitsOfMeasure: createCrud("/api/v1/uoms"),
    employees: createCrud("/api/v1/employees"),
    equipmentConditions: createCrud("/api/v1/equipment-conditions", { readOnly: true, noGetById: true }),
};

import type { Organization } from "../model/types";

type CreateDto = { fullName: string; city: string | null };
type UpdateDto = { fullName: string; city: string | null };

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const LS_KEY = "mock.organizations.v1";

function read(): Organization[] {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
        const seed: Organization[] = [
            { id: 1, fullName: "ООО ГОРСВЕТ", city: "Riga" },
            { id: 2, fullName: "SIA CityLight", city: "Daugavpils" },
        ];
        localStorage.setItem(LS_KEY, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(raw) as Organization[];
}

function write(items: Organization[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export const organizationMockRepo = {
    async list(): Promise<Organization[]> {
        await delay();
        return read().sort((a, b) => a.id - b.id);
    },

    async create(dto: CreateDto): Promise<Organization> {
        await delay();
        const items = read();
        const nextId = items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
        const created: Organization = { id: nextId, fullName: dto.fullName, city: dto.city };
        write([created, ...items]);
        return created;
    },

    async update(id: number, dto: UpdateDto): Promise<Organization> {
        await delay();
        const items = read();
        const idx = items.findIndex((x) => x.id === id);
        if (idx === -1) throw new Error("Organization not found");
        const updated: Organization = { ...items[idx], fullName: dto.fullName, city: dto.city };
        items[idx] = updated;
        write(items);
        return updated;
    },

    async remove(id: number): Promise<void> {
        await delay();
        const items = read().filter((x) => x.id !== id);
        write(items);
    },
};

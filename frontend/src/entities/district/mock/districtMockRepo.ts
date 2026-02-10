import type { District } from "../model/types";

type CreateDto = { name: string };
type UpdateDto = { name: string };

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const LS_KEY = "mock.districts.v1";

function read(): District[] {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
        const seed: District[] = [
            { id: 1, name: "Центральный район" },
            { id: 2, name: "Северный район" },
        ];
        localStorage.setItem(LS_KEY, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(raw) as District[];
}

function write(items: District[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export const districtMockRepo = {
    async list(): Promise<District[]> {
        await delay();
        return read().sort((a, b) => a.id - b.id);
    },

    async create(dto: CreateDto): Promise<District> {
        await delay();
        const items = read();
        const nextId = items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
        const created: District = { id: nextId, name: dto.name };
        write([created, ...items]);
        return created;
    },

    async update(id: number, dto: UpdateDto): Promise<District> {
        await delay();
        const items = read();
        const idx = items.findIndex((x) => x.id === id);
        if (idx === -1) throw new Error("District not found");
        const updated: District = { ...items[idx], name: dto.name };
        items[idx] = updated;
        write(items);
        return updated;
    },

    async remove(id: number): Promise<void> {
        await delay();
        write(read().filter((x) => x.id !== id));
    },
};

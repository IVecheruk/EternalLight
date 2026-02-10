import type { Street } from "../model/types";

type CreateDto = { name: string; districtId: number | null };
type UpdateDto = { name: string; districtId: number | null };

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const LS_KEY = "mock.streets.v1";

function read(): Street[] {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
        const seed: Street[] = [
            { id: 1, name: "Brīvības iela", districtId: 1 },
            { id: 2, name: "Krišjāņa Barona iela", districtId: 1 },
            { id: 3, name: "Tērbatas iela", districtId: 2 },
        ];
        localStorage.setItem(LS_KEY, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(raw) as Street[];
}

function write(items: Street[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export const streetMockRepo = {
    async list(): Promise<Street[]> {
        await delay();
        return read().sort((a, b) => a.id - b.id);
    },

    async create(dto: CreateDto): Promise<Street> {
        await delay();
        const items = read();
        const nextId = items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
        const created: Street = { id: nextId, name: dto.name, districtId: dto.districtId };
        write([created, ...items]);
        return created;
    },

    async update(id: number, dto: UpdateDto): Promise<Street> {
        await delay();
        const items = read();
        const idx = items.findIndex((x) => x.id === id);
        if (idx === -1) throw new Error("Street not found");
        const updated: Street = { ...items[idx], name: dto.name, districtId: dto.districtId };
        items[idx] = updated;
        write(items);
        return updated;
    },

    async remove(id: number): Promise<void> {
        await delay();
        write(read().filter((x) => x.id !== id));
    },
};

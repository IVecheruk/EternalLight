import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import {
    administrativeDistrictApi,
    type AdministrativeDistrict,
} from "@/entities/district/api/administrativeDistrictApi";

type Mode = "create" | "edit";

export function DistrictsPage() {
    const [items, setItems] = useState<AdministrativeDistrict[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("create");
    const [selected, setSelected] = useState<AdministrativeDistrict | null>(null);

    const [query, setQuery] = useState("");

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await administrativeDistrictApi.list();
            setItems(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось загрузить административные районы");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((x) => x.name.toLowerCase().includes(q));
    }, [items, query]);

    const onCreate = () => {
        setMode("create");
        setSelected(null);
        setOpen(true);
    };

    const onEdit = (d: AdministrativeDistrict) => {
        setMode("edit");
        setSelected(d);
        setOpen(true);
    };

    const onDelete = async (id: number) => {
        if (!confirm("Удалить район?")) return;
        try {
            await administrativeDistrictApi.remove(id);
            await load();
        } catch (e) {
            alert(e instanceof Error ? e.message : "Не удалось удалить район");
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Districts</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Административные районы (backend: /api/v1/administrative-districts)
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name…"
                        className="w-56 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    />
                    <button
                        type="button"
                        onClick={onCreate}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                    >
                        + New
                    </button>
                </div>
            </header>

            {loading && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
                    Loading…
                </div>
            )}

            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div>
            )}

            {!loading && !error && (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-800">
                        <div>Total: {filtered.length}</div>
                        <button
                            type="button"
                            onClick={() => void load()}
                            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                        >
                            Refresh
                        </button>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="px-5 py-6 text-sm text-neutral-600 dark:text-neutral-300">
                            Пока пусто. Нажми <span className="font-medium">+ New</span>.
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filtered.map((d) => (
                                <li key={d.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold">{d.name}</div>
                                            <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                                                <span className="font-medium">ID:</span> {d.id}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(d)}
                                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => void onDelete(d.id)}
                                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <Modal
                open={open}
                title={mode === "create" ? "Create administrative district" : "Update administrative district"}
                onClose={() => setOpen(false)}
            >
                <DistrictForm
                    mode={mode}
                    initial={selected}
                    onCancel={() => setOpen(false)}
                    onSaved={async () => {
                        setOpen(false);
                        await load();
                    }}
                />
            </Modal>
        </div>
    );
}

function DistrictForm(props: {
    mode: "create" | "edit";
    initial: AdministrativeDistrict | null;
    onSaved: () => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState(props.initial?.name ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setName(props.initial?.name ?? "");
    }, [props.initial]);

    const submit = async () => {
        const n = name.trim();
        if (!n) {
            setError("name обязателен.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (props.mode === "create") {
                await administrativeDistrictApi.create({ name: n });
            } else {
                if (!props.initial) throw new Error("Нет выбранного района для обновления");
                await administrativeDistrictApi.update(props.initial.id, { name: n });
            }

            props.onSaved();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ошибка сохранения");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Центральный"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={props.onCancel}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={() => void submit()}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                    disabled={loading}
                >
                    {loading ? (props.mode === "create" ? "Creating…" : "Saving…") : props.mode === "create" ? "Create" : "Save"}
                </button>
            </div>
        </div>
    );
}

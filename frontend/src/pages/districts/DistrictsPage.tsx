import { useEffect, useMemo, useState } from "react";
import { TablePage } from "@/shared/ui/TablePage";
import { Modal } from "@/shared/ui/Modal";
import { districtApi } from "@/entities/district/api/districtApi";
import type { District } from "@/entities/district/model/types";

type FormState = { name: string };

export const DistrictsPage = () => {
    const [items, setItems] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<District | null>(null);

    const [form, setForm] = useState<FormState>({ name: "" });

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            setItems(await districtApi.list());
        } catch (e: any) {
            setError(e?.message ?? "Не удалось загрузить районы.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const actions = useMemo(
        () => (
            <button
                type="button"
                onClick={() => {
                    setForm({ name: "" });
                    setCreateOpen(true);
                }}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
                + New
            </button>
        ),
        []
    );

    const openEdit = (d: District) => {
        setSelected(d);
        setForm({ name: d.name });
        setEditOpen(true);
    };

    const submitCreate = async () => {
        const name = form.name.trim();
        if (!name) return setError("name обязателен.");

        try {
            setError(null);
            await districtApi.create({ name });
            setCreateOpen(false);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось создать район.");
        }
    };

    const submitEdit = async () => {
        if (!selected) return;
        const name = form.name.trim();
        if (!name) return setError("name обязателен.");

        try {
            setError(null);
            await districtApi.update(selected.id, { name });
            setEditOpen(false);
            setSelected(null);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось обновить район.");
        }
    };

    const onDelete = async (d: District) => {
        const ok = confirm(`Удалить район "${d.name}"?`);
        if (!ok) return;

        try {
            setError(null);
            await districtApi.remove(d.id);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось удалить район.");
        }
    };

    return (
        <>
            <TablePage
                title="Districts"
                subtitle="Справочник районов."
                actions={actions}
                loading={loading}
                error={error}
            >
                <div className="border-b border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-900">
                    Total: {items.length}
                </div>

                {items.length === 0 ? (
                    <div className="px-5 py-6 text-sm text-neutral-600">
                        Пока пусто. Нажми <span className="font-medium">+ New</span>, чтобы создать первый район.
                    </div>
                ) : (
                    <ul className="divide-y divide-neutral-200">
                        {items.map((d) => (
                            <li key={d.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-neutral-900">{d.name}</div>
                                        <div className="mt-1 text-xs text-neutral-600">
                                            <span className="font-medium text-neutral-700">ID:</span> {d.id}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(d)}
                                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void onDelete(d)}
                                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </TablePage>

            <Modal open={createOpen} title="Create district" onClose={() => setCreateOpen(false)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-700">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            placeholder="Центральный район"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setCreateOpen(false)}
                            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => void submitCreate()}
                            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal open={editOpen} title="Update district" onClose={() => setEditOpen(false)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-700">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditOpen(false)}
                            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => void submitEdit()}
                            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

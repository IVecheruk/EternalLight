import { useEffect, useMemo, useState } from "react";
import { TablePage } from "@/shared/ui/TablePage";
import { Modal } from "@/shared/ui/Modal";
import { streetApi } from "@/entities/street/api/streetApi";
import type { Street } from "@/entities/street/model/types";
import { districtApi } from "@/entities/district/api/districtApi";
import type { District } from "@/entities/district/model/types";

type FormState = { name: string; districtId: number | null };

export const StreetsPage = () => {
    const [items, setItems] = useState<Street[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<Street | null>(null);

    const [form, setForm] = useState<FormState>({ name: "", districtId: null });

    const districtNameById = useMemo(() => {
        const map = new Map<number, string>();
        districts.forEach((d) => map.set(d.id, d.name));
        return map;
    }, [districts]);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [streets, dists] = await Promise.all([streetApi.list(), districtApi.list()]);
            setItems(streets);
            setDistricts(dists);
        } catch (e: any) {
            setError(e?.message ?? "Не удалось загрузить улицы.");
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
                    setForm({ name: "", districtId: null });
                    setCreateOpen(true);
                }}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
                + New
            </button>
        ),
        []
    );

    const openEdit = (s: Street) => {
        setSelected(s);
        setForm({ name: s.name, districtId: s.districtId ?? null });
        setEditOpen(true);
    };

    const submitCreate = async () => {
        const name = form.name.trim();
        if (!name) return setError("name обязателен.");

        try {
            setError(null);
            await streetApi.create({ name, districtId: form.districtId });
            setCreateOpen(false);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось создать улицу.");
        }
    };

    const submitEdit = async () => {
        if (!selected) return;
        const name = form.name.trim();
        if (!name) return setError("name обязателен.");

        try {
            setError(null);
            await streetApi.update(selected.id, { name, districtId: form.districtId });
            setEditOpen(false);
            setSelected(null);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось обновить улицу.");
        }
    };

    const onDelete = async (s: Street) => {
        const ok = confirm(`Удалить улицу "${s.name}"?`);
        if (!ok) return;

        try {
            setError(null);
            await streetApi.remove(s.id);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось удалить улицу.");
        }
    };

    return (
        <>
            <TablePage
                title="Streets"
                subtitle="Справочник улиц (с привязкой к району)."
                actions={actions}
                loading={loading}
                error={error}
            >
                <div className="border-b border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-900">
                    Total: {items.length}
                </div>

                {items.length === 0 ? (
                    <div className="px-5 py-6 text-sm text-neutral-600">
                        Пока пусто. Нажми <span className="font-medium">+ New</span>, чтобы создать первую улицу.
                    </div>
                ) : (
                    <ul className="divide-y divide-neutral-200">
                        {items.map((s) => (
                            <li key={s.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-neutral-900">{s.name}</div>
                                        <div className="mt-1 text-xs text-neutral-600">
                                            <span className="font-medium text-neutral-700">ID:</span> {s.id}
                                            {" • "}
                                            <span className="font-medium text-neutral-700">District:</span>{" "}
                                            {s.districtId ? districtNameById.get(s.districtId) ?? `#${s.districtId}` : "—"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEdit(s)}
                                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void onDelete(s)}
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

            <Modal open={createOpen} title="Create street" onClose={() => setCreateOpen(false)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-700">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            placeholder="Brīvības iela"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-700">District</label>
                        <select
                            value={form.districtId ?? 0}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                setForm((s) => ({ ...s, districtId: v === 0 ? null : v }));
                            }}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        >
                            <option value={0}>— не выбран —</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
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

            <Modal open={editOpen} title="Update street" onClose={() => setEditOpen(false)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-700">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-neutral-700">District</label>
                        <select
                            value={form.districtId ?? 0}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                setForm((s) => ({ ...s, districtId: v === 0 ? null : v }));
                            }}
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        >
                            <option value={0}>— не выбран —</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
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

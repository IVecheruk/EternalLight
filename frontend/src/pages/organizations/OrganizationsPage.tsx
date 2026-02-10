import { useEffect, useMemo, useState } from "react";
import { organizationApi } from "@/entities/organization/api/organizationApi";
import type { Organization } from "@/entities/organization/model/types";
import { Modal } from "@/shared/ui/Modal";
import { PageShell } from "@/shared/ui/PageShell";
import { CreateOrganizationForm } from "@/features/organizations/create/ui/CreateOrganizationForm";
import { UpdateOrganizationForm } from "@/features/organizations/update/ui/UpdateOrganizationForm";

export const OrganizationsPage = () => {
    const [items, setItems] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<Organization | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await organizationApi.list();
            setItems(data);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Не удалось загрузить organizations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const total = useMemo(() => items.length, [items]);

    const openEdit = (o: Organization) => {
        setSelected(o);
        setEditOpen(true);
    };

    const remove = async (o: Organization) => {
        if (!confirm(`Удалить организацию "${o.fullName}"?`)) return;
        try {
            await organizationApi.remove(o.id);
            await load();
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Не удалось удалить.");
        }
    };

    return (
        <PageShell
            title="Organizations"
            description="UI-страница списка организаций. API можно подключать/отключать без ломания маршрутов."
            right={
                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                >
                    + New
                </button>
            }
        >
            {loading ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
                    Loading…
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    {error}
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 text-sm">
                        <div className="font-medium text-neutral-900">Total: {total}</div>
                        <div className="text-neutral-500">CRUD: create / update / delete</div>
                    </div>

                    {items.length === 0 ? (
                        <div className="px-5 py-6 text-sm text-neutral-600">
                            Пока пусто. Нажми <span className="font-medium">+ New</span>, чтобы создать первую
                            организацию.
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {items.map((o) => (
                                <li key={o.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-neutral-900">
                                                {o.fullName}
                                            </div>

                                            <div className="mt-1 text-xs text-neutral-600">
                                                <span className="font-medium text-neutral-700">ID:</span> {o.id}
                                                {o.city ? (
                                                    <>
                                                        {" "}
                                                        • <span className="font-medium text-neutral-700">City:</span>{" "}
                                                        {o.city}
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <button
                                                type="button"
                                                className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:bg-neutral-50"
                                                onClick={() => openEdit(o)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-800 hover:bg-red-100"
                                                onClick={() => remove(o)}
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

            <Modal open={createOpen} title="Create organization" onClose={() => setCreateOpen(false)}>
                <CreateOrganizationForm
                    onCancel={() => setCreateOpen(false)}
                    onCreated={async () => {
                        setCreateOpen(false);
                        await load();
                    }}
                />
            </Modal>

            <Modal
                open={editOpen}
                title="Update organization"
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
            >
                {selected ? (
                    <UpdateOrganizationForm
                        initial={selected}
                        onCancel={() => {
                            setEditOpen(false);
                            setSelected(null);
                        }}
                        onUpdated={async () => {
                            setEditOpen(false);
                            setSelected(null);
                            await load();
                        }}
                    />
                ) : null}
            </Modal>
        </PageShell>
    );
};

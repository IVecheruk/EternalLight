import { useEffect, useMemo, useState } from "react";
import { organizationApi } from "@/entities/organization/api/organizationApi";
import type { Organization } from "@/entities/organization/model/types";
import { TablePage } from "@/shared/ui/TablePage";
import { Modal } from "@/shared/ui/Modal";
import { CreateOrganizationForm } from "@/features/organizations/create/ui/CreateOrganizationForm";
import { UpdateOrganizationForm } from "@/features/organizations/update/ui/UpdateOrganizationForm";

export const OrganizationsPage = () => {
    const [items, setItems] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
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
        } catch (e: any) {
            setError(e?.message ?? "Не удалось загрузить organizations.");
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
                onClick={() => setCreateOpen(true)}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
                + New
            </button>
        ),
        []
    );

    const onEdit = (o: Organization) => {
        setSelected(o);
        setEditOpen(true);
    };

    const onDelete = async (o: Organization) => {
        const ok = confirm(`Удалить организацию "${o.fullName}"?`);
        if (!ok) return;

        try {
            setError(null);
            await organizationApi.remove(o.id);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось удалить организацию.");
        }
    };

    return (
        <>
            <TablePage
                title="Organizations"
                subtitle="Справочник организаций."
                actions={actions}
                loading={loading}
                error={error}
            >
                <div className="border-b border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-900">
                    Total: {items.length}
                </div>

                {items.length === 0 ? (
                    <div className="px-5 py-6 text-sm text-neutral-600">
                        Пока пусто. Нажми <span className="font-medium">+ New</span>, чтобы создать первую организацию.
                    </div>
                ) : (
                    <ul className="divide-y divide-neutral-200">
                        {items.map((o) => (
                            <li key={o.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-neutral-900">{o.fullName}</div>
                                        <div className="mt-1 text-xs text-neutral-600">
                                            <span className="font-medium text-neutral-700">ID:</span> {o.id}
                                            {o.city ? (
                                                <>
                                                    {" "}
                                                    • <span className="font-medium text-neutral-700">City:</span> {o.city}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(o)}
                                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void onDelete(o)}
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

            <Modal open={createOpen} title="Create organization" onClose={() => setCreateOpen(false)}>
                <CreateOrganizationForm
                    onCancel={() => setCreateOpen(false)}
                    onCreated={async () => {
                        setCreateOpen(false);
                        await load();
                    }}
                />
            </Modal>

            <Modal open={editOpen} title="Update organization" onClose={() => setEditOpen(false)}>
                {selected ? (
                    <UpdateOrganizationForm
                        initial={selected}
                        onCancel={() => setEditOpen(false)}
                        onUpdated={async () => {
                            setEditOpen(false);
                            await load();
                        }}
                    />
                ) : null}
            </Modal>
        </>
    );
};

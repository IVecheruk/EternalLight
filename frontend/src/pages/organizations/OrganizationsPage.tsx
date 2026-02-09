import { useEffect, useState } from "react";
import { organizationApi } from "@/entities/organization/api/organizationApi";
import type { Organization } from "@/entities/organization/model/types";
import { Modal } from "@/shared/ui/Modal";
import { CreateOrganizationForm } from "@/features/organizations/create/ui/CreateOrganizationForm";

export default function OrganizationsPage() {
    const [items, setItems] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await organizationApi.list();
            setItems(data);
        } catch {
            setError("Не удалось загрузить organizations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Organizations
                    </h1>
                    <p className="text-sm text-gray-600">
                        Список организаций из backend (Spring Boot).
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                >
                    + New
                </button>
            </header>

            {/* Content */}
            {loading && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
                    Loading…
                </div>
            )}

            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-5 py-3 text-sm font-medium text-gray-900">
                        Total: {items.length}
                    </div>

                    {items.length === 0 ? (
                        <div className="px-5 py-6 text-sm text-gray-600">
                            Пока пусто. Нажми <span className="font-medium">+ New</span>, чтобы
                            создать первую организацию.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.map((o) => (
                                <li key={o.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-gray-900">
                                                {o.fullName}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-600">
                                                <span className="font-medium text-gray-700">ID:</span>{" "}
                                                {o.id}
                                                {o.city ? (
                                                    <>
                                                        {" "}
                                                        •{" "}
                                                        <span className="font-medium text-gray-700">
                              City:
                            </span>{" "}
                                                        {o.city}
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {/* позже сюда добавим Edit/Delete */}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Create modal */}
            <Modal
                open={createOpen}
                title="Create organization"
                onClose={() => setCreateOpen(false)}
            >
                <CreateOrganizationForm
                    onCancel={() => setCreateOpen(false)}
                    onCreated={async () => {
                        setCreateOpen(false);
                        await load();
                    }}
                />
            </Modal>
        </div>
    );
}

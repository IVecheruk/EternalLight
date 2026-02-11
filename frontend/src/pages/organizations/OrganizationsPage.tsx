import { useState } from "react";
import { TablePage } from "@/shared/ui/TablePage";
import { TextField } from "@/shared/ui/TextField";

import { organizationApi } from "@/entities/organization/api/organizationApi";
import type { Organization } from "@/entities/organization/model/types";

type OrgFormState = {
    fullName: string;
    city: string;
};

function CreateOrgForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
    const [form, setForm] = useState<OrgFormState>({ fullName: "", city: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        const fullName = form.fullName.trim();
        const city = form.city.trim();

        if (!fullName) {
            setError("fullName обязателен.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await organizationApi.create({
                fullName,
                city: city.length ? city : null,
            });

            onDone();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось создать организацию.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            )}

            <TextField
                label="Full name"
                value={form.fullName}
                placeholder="ООО ГОРСВЕТ"
                onChange={(v) => setForm((s) => ({ ...s, fullName: v }))}
            />
            <TextField
                label="City"
                value={form.city}
                placeholder="Barnaul"
                onChange={(v) => setForm((s) => ({ ...s, city: v }))}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
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
                    {loading ? "Creating…" : "Create"}
                </button>
            </div>
        </div>
    );
}

export function OrganizationsPage() {
    return (
        <TablePage<Organization>
            title="Organizations"
            subtitle="Базовая CRUD-страница. Пока без auth-защиты."
            load={() => organizationApi.list()}
            getRowId={(o) => o.id}
            columns={[
                { key: "id", header: "ID", render: (o) => o.id, className: "w-[90px] text-neutral-500" },
                { key: "fullName", header: "Full name", render: (o) => o.fullName ?? "—" },
                { key: "city", header: "City", render: (o) => o.city ?? "—", className: "w-[180px]" },
            ]}
            canCreate
            canEdit={false} // пока выключаем, когда сделаем update api — включим
            canRemove
            renderCreate={({ onDone, onCancel }) => <CreateOrgForm onDone={onDone} onCancel={onCancel} />}
            remove={(o) => organizationApi.remove(o.id)}
        />
    );
}

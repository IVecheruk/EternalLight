import { useCallback, useMemo, useState } from "react";
import { TablePage } from "@/shared/ui/TablePage";
import { TextField } from "@/shared/ui/TextField";
import { streetApi } from "@/entities/street/api/streetApi";
import type { Street } from "@/entities/street/model/types";
import { districtApi } from "@/entities/district/api/districtApi";
import type { District } from "@/entities/district/model/types";

type FormState = { name: string; districtId: number | null };

type StreetFormProps = {
    initial?: FormState;
    submitLabel: string;
    districts: District[];
    onSubmit: (data: FormState) => Promise<void>;
    onDone: () => void;
    onCancel: () => void;
};

function StreetForm({
    initial = { name: "", districtId: null },
    submitLabel,
    districts,
    onSubmit,
    onDone,
    onCancel,
}: StreetFormProps) {
    const [form, setForm] = useState<FormState>(initial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        const name = form.name.trim();
        if (!name) {
            setError("Name is required.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await onSubmit({ name, districtId: form.districtId });
            onDone();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save street.");
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

            <TextField
                label="Name"
                value={form.name}
                placeholder="Brivibas iela"
                onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            />

            <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">District</label>
                <select
                    value={form.districtId ?? 0}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        setForm((s) => ({ ...s, districtId: v === 0 ? null : v }));
                    }}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600"
                    disabled={loading}
                >
                    <option value={0}>Not selected</option>
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
                    {loading ? "Saving..." : submitLabel}
                </button>
            </div>
        </div>
    );
}

export function StreetsPage() {
    const [districts, setDistricts] = useState<District[]>([]);

    const districtNameById = useMemo(() => {
        const map = new Map<number, string>();
        districts.forEach((d) => map.set(d.id, d.name));
        return map;
    }, [districts]);

    const load = useCallback(async () => {
        const [streets, dists] = await Promise.all([streetApi.list(), districtApi.list()]);
        setDistricts(dists);
        return streets;
    }, []);

    return (
        <TablePage<Street>
            title="Streets"
            subtitle="Street directory with district binding."
            load={load}
            getRowId={(s) => s.id}
            columns={[
                { key: "id", header: "ID", render: (s) => s.id, className: "w-[90px] text-neutral-500" },
                { key: "name", header: "Name", render: (s) => s.name },
                {
                    key: "district",
                    header: "District",
                    render: (s) =>
                        s.districtId ? districtNameById.get(s.districtId) ?? `#${s.districtId}` : "None",
                },
            ]}
            canCreate
            canEdit
            canRemove
            renderCreate={({ onDone, onCancel }) => (
                <StreetForm
                    submitLabel="Create"
                    districts={districts}
                    onSubmit={async (data) => {
                        await streetApi.create({ name: data.name, districtId: data.districtId });
                    }}
                    onDone={onDone}
                    onCancel={onCancel}
                />
            )}
            renderEdit={(row, { onDone, onCancel }) => (
                <StreetForm
                    initial={{ name: row.name, districtId: row.districtId ?? null }}
                    submitLabel="Save"
                    districts={districts}
                    onSubmit={async (data) => {
                        await streetApi.update(row.id, { name: data.name, districtId: data.districtId });
                    }}
                    onDone={onDone}
                    onCancel={onCancel}
                />
            )}
            remove={(s) => streetApi.remove(s.id)}
        />
    );
}

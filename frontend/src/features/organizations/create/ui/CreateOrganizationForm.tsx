import { useState } from "react";
import { organizationApi, type CreateOrganizationRequest } from "@/entities/organization/api/organizationApi";

type Props = {
    onCreated: () => void | Promise<void>;
    onCancel: () => void;
};

export const CreateOrganizationForm = ({ onCreated, onCancel }: Props) => {
    const [form, setForm] = useState<CreateOrganizationRequest>({ fullName: "", city: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        const fullName = form.fullName.trim();
        const city = (form.city ?? "").trim();

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

            await onCreated();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось создать организацию.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            )}

            <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700">Full name</label>
                <input
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="ООО ГОРСВЕТ"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700">City</label>
                <input
                    value={form.city ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Riga"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={submit}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Creating…" : "Create"}
                </button>
            </div>
        </div>
    );
};

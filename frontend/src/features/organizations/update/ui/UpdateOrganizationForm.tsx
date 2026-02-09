import { useState } from "react";
import { organizationApi, type UpdateOrganizationRequest } from "@/entities/organization/api/organizationApi";
import type { Organization } from "@/entities/organization/model/types";

type Props = {
    initial: Organization;
    onUpdated: () => void;
    onCancel: () => void;
};

export const UpdateOrganizationForm = ({ initial, onUpdated, onCancel }: Props) => {
    const [form, setForm] = useState<UpdateOrganizationRequest>({
        fullName: initial.fullName ?? "",
        city: initial.city ?? "",
    });

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
            await organizationApi.update(initial.id, {
                fullName,
                city: city.length ? city : null,
            });
            onUpdated();
        } catch {
            setError("Не удалось обновить организацию.");
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
                <label className="block text-xs font-medium text-gray-700">Full name</label>
                <input
                    value={form.fullName}
                    onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">City</label>
                <input
                    value={form.city ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={submit}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Saving…" : "Save"}
                </button>
            </div>
        </div>
    );
};

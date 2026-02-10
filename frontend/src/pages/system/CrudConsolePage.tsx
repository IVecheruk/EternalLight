import { useMemo, useState } from "react";
import { http } from "@/shared/api/http";

type Resource = {
    key: string;
    label: string;
    endpoint: string;
    readOnly?: boolean;
};

const resources: Resource[] = [
    { key: "organizations", label: "Organizations", endpoint: "/api/v1/organizations" },
    { key: "districts", label: "Administrative districts", endpoint: "/api/v1/administrative-districts" },
    { key: "streets", label: "Streets", endpoint: "/api/v1/streets" },
    { key: "lightingObjects", label: "Lighting objects", endpoint: "/api/v1/lighting-objects" },
    { key: "workActs", label: "Work acts", endpoint: "/api/v1/work-acts" },
    { key: "workBasisTypes", label: "Work basis types", endpoint: "/api/v1/work-basis-types" },
    { key: "brigadeRoles", label: "Brigade roles", endpoint: "/api/v1/brigade-roles" },
    { key: "faultTypes", label: "Fault types", endpoint: "/api/v1/fault-types" },
    { key: "uoms", label: "Units of measure", endpoint: "/api/v1/uoms" },
    { key: "employees", label: "Employees", endpoint: "/api/v1/employees" },
    { key: "equipmentConditions", label: "Equipment conditions", endpoint: "/api/v1/equipment-conditions", readOnly: true },
];

function pretty(value: unknown): string {
    return JSON.stringify(value, null, 2);
}

export function CrudConsolePage() {
    const [resourceKey, setResourceKey] = useState(resources[0].key);
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [payload, setPayload] = useState<string>("{}\n");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resource = useMemo(
        () => resources.find((r) => r.key === resourceKey) ?? resources[0],
        [resourceKey]
    );

    const load = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const data = await http<unknown>(resource.endpoint, { auth: true });
            if (Array.isArray(data)) {
                setRows(data as Record<string, unknown>[]);
                setMessage(`Loaded ${data.length} records.`);
                return;
            }

            const pageLike = (data ?? {}) as { content?: Record<string, unknown>[] };
            if (Array.isArray(pageLike.content)) {
                setRows(pageLike.content);
                setMessage(`Loaded ${pageLike.content.length} records (paginated response).`);
                return;
            }

            setRows([]);
            setMessage("Response is not a list. Check endpoint specifics.");
        } catch (e: any) {
            setRows([]);
            setError(e?.message ?? "Load failed");
        } finally {
            setLoading(false);
        }
    };

    const parsePayload = (): Record<string, unknown> => {
        const parsed = JSON.parse(payload);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("Payload must be a JSON object");
        }
        return parsed;
    };

    const createItem = async () => {
        if (resource.readOnly) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const body = parsePayload();
            const created = await http<unknown>(resource.endpoint, {
                method: "POST",
                auth: true,
                body: JSON.stringify(body),
            });
            setMessage(`Created: ${pretty(created)}`);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Create failed");
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async () => {
        if (resource.readOnly) return;
        if (!selectedId.trim()) {
            setError("Set ID for update");
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const body = parsePayload();
            const updated = await http<unknown>(`${resource.endpoint}/${selectedId.trim()}`, {
                method: "PUT",
                auth: true,
                body: JSON.stringify(body),
            });
            setMessage(`Updated: ${pretty(updated)}`);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async () => {
        if (resource.readOnly) return;
        if (!selectedId.trim()) {
            setError("Set ID for delete");
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await http<void>(`${resource.endpoint}/${selectedId.trim()}`, {
                method: "DELETE",
                auth: true,
            });
            setMessage(`Deleted id=${selectedId.trim()}`);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">CRUD Console</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Единая страница для базового CRUD по backend ресурсам.
                </p>
            </header>

            <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 md:grid-cols-[1fr_220px_auto_auto_auto]">
                <select
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    value={resourceKey}
                    onChange={(e) => setResourceKey(e.target.value)}
                >
                    {resources.map((r) => (
                        <option key={r.key} value={r.key}>
                            {r.label}
                        </option>
                    ))}
                </select>
                <input
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    placeholder="ID for update/delete"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                />
                <button type="button" onClick={() => void load()} className="rounded-xl border px-4 py-2 text-sm">
                    Load
                </button>
                <button
                    type="button"
                    disabled={resource.readOnly}
                    onClick={() => void createItem()}
                    className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
                >
                    Create
                </button>
                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={resource.readOnly}
                        onClick={() => void updateItem()}
                        className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        disabled={resource.readOnly}
                        onClick={() => void removeItem()}
                        className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                    <div className="text-sm font-medium">JSON payload</div>
                    <textarea
                        className="h-80 w-full rounded-2xl border border-neutral-200 bg-white p-3 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-900"
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                    />
                    <div className="text-xs text-neutral-500">Endpoint: {resource.endpoint}</div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium">Response list</div>
                    <pre className="h-80 overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
                        {pretty(rows)}
                    </pre>
                </div>
            </div>

            {loading ? <div className="text-sm">Loading...</div> : null}
            {message ? <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-800">{message}</div> : null}
            {error ? <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}
        </div>
    );
}

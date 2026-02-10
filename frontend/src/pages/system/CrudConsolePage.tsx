import { useMemo, useState } from "react";
import { http } from "@/shared/api/http";

type Resource = {
    key: string;
    label: string;
    endpoint: string;
    readOnly?: boolean;
};

type PayloadField = {
    key: string;
    value: string;
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
    { key: "workActBasis", label: "Work act basis (set workActId in endpoint)", endpoint: "/api/v1/work-acts/1/basis" },
    { key: "workActFaults", label: "Work act faults (set workActId in endpoint)", endpoint: "/api/v1/work-acts/1/faults" },
    { key: "workActBrigade", label: "Work act brigade (set workActId in endpoint)", endpoint: "/api/v1/work-acts/1/brigade" },
    { key: "workActMaterials", label: "Work act materials (set workActId in endpoint)", endpoint: "/api/v1/work-acts/1/materials" },
    { key: "workActLabor", label: "Work act labor items (set workActId in endpoint)", endpoint: "/api/v1/work-acts/1/labor-items" },
];

function pretty(value: unknown): string {
    return JSON.stringify(value, null, 2);
}

function joinUrl(endpoint: string, id?: string, query?: string) {
    const cleanEndpoint = endpoint.trim();
    const cleanId = id?.trim();
    const cleanQuery = query?.trim();

    const withId = cleanId ? `${cleanEndpoint}/${cleanId}` : cleanEndpoint;
    if (!cleanQuery) return withId;

    const q = cleanQuery.startsWith("?") ? cleanQuery.slice(1) : cleanQuery;
    return `${withId}?${q}`;
}

function parseValue(raw: string): unknown {
    const trimmed = raw.trim();
    if (trimmed === "") return "";
    if (trimmed === "null") return null;
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (!Number.isNaN(Number(trimmed)) && trimmed !== "") return Number(trimmed);
    return trimmed;
}

export function CrudConsolePage() {
    const [resourceKey, setResourceKey] = useState(resources[0].key);
    const [endpoint, setEndpoint] = useState(resources[0].endpoint);
    const [query, setQuery] = useState("");
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [responseBody, setResponseBody] = useState<unknown>(null);
    const [selectedId, setSelectedId] = useState<string>("");
    const [fields, setFields] = useState<PayloadField[]>([{ key: "name", value: "" }]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const resource = useMemo(
        () => resources.find((r) => r.key === resourceKey) ?? resources[0],
        [resourceKey]
    );

    const setResource = (nextKey: string) => {
        setResourceKey(nextKey);
        const next = resources.find((r) => r.key === nextKey);
        if (!next) return;
        setEndpoint(next.endpoint);
        setQuery(next.key === "workActs" ? "page=0&size=20" : "");
        setSelectedId("");
        setRows([]);
        setResponseBody(null);
        setError(null);
        setMessage(null);
    };

    const load = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const data = await http<unknown>(joinUrl(endpoint, undefined, query), { auth: true });
            setResponseBody(data);

            if (Array.isArray(data)) {
                setRows(data as Record<string, unknown>[]);
                setMessage(`Loaded ${data.length} records.`);
            } else {
                const pageLike = (data ?? {}) as { content?: Record<string, unknown>[] };
                if (Array.isArray(pageLike.content)) {
                    setRows(pageLike.content);
                    setMessage(`Loaded ${pageLike.content.length} records (paginated response).`);
                } else {
                    setRows([]);
                    setMessage("Loaded object response.");
                }
            }
        } catch (e: any) {
            setRows([]);
            setResponseBody(null);
            setError(e?.message ?? "Load failed");
        } finally {
            setLoading(false);
        }
    };

    const getById = async () => {
        if (!selectedId.trim()) {
            setError("Set ID for GET by id");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const data = await http<unknown>(joinUrl(endpoint, selectedId, query), { auth: true });
            setResponseBody(data);
            setRows([]);
            setMessage("Loaded entity by id.");
        } catch (e: any) {
            setError(e?.message ?? "GET by id failed");
        } finally {
            setLoading(false);
        }
    };

    const buildPayload = (): Record<string, unknown> => {
        const obj: Record<string, unknown> = {};
        for (const field of fields) {
            const key = field.key.trim();
            if (!key) continue;
            obj[key] = parseValue(field.value);
        }

        if (Object.keys(obj).length === 0) {
            throw new Error("Add at least one payload field");
        }

        return obj;
    };

    const createItem = async () => {
        if (resource.readOnly) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const created = await http<unknown>(joinUrl(endpoint, undefined, query), {
                method: "POST",
                auth: true,
                body: JSON.stringify(buildPayload()),
            });
            setResponseBody(created);
            setMessage("Created entity.");
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
            const updated = await http<unknown>(joinUrl(endpoint, selectedId, query), {
                method: "PUT",
                auth: true,
                body: JSON.stringify(buildPayload()),
            });
            setResponseBody(updated);
            setMessage("Updated entity.");
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
            await http<void>(joinUrl(endpoint, selectedId, query), {
                method: "DELETE",
                auth: true,
            });
            setResponseBody({ deletedId: selectedId.trim() });
            setMessage(`Deleted id=${selectedId.trim()}`);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (index: number, patch: Partial<PayloadField>) => {
        setFields((prev) => prev.map((field, i) => (i === index ? { ...field, ...patch } : field)));
    };

    const addField = () => setFields((prev) => [...prev, { key: "", value: "" }]);
    const removeField = (index: number) => setFields((prev) => prev.filter((_, i) => i !== index));

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">CRUD Console</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Единая рабочая страница для backend CRUD и nested endpoints.
                </p>
            </header>

            <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 md:grid-cols-2">
                <label className="space-y-1 text-xs">
                    <span>Resource preset</span>
                    <select
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        value={resourceKey}
                        onChange={(e) => setResource(e.target.value)}
                    >
                        {resources.map((r) => (
                            <option key={r.key} value={r.key}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="space-y-1 text-xs">
                    <span>Endpoint (editable)</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                    />
                </label>

                <label className="space-y-1 text-xs">
                    <span>Query string</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="page=0&size=20"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>

                <label className="space-y-1 text-xs">
                    <span>ID (for GET/PUT/DELETE)</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="resource id"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    />
                </label>

                <div className="col-span-full flex flex-wrap gap-2">
                    <button type="button" onClick={() => void load()} className="rounded-xl border px-4 py-2 text-sm">Load list</button>
                    <button type="button" onClick={() => void getById()} className="rounded-xl border px-4 py-2 text-sm">Get by ID</button>
                    <button type="button" disabled={resource.readOnly} onClick={() => void createItem()} className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50">Create</button>
                    <button type="button" disabled={resource.readOnly} onClick={() => void updateItem()} className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50">Update</button>
                    <button type="button" disabled={resource.readOnly} onClick={() => void removeItem()} className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Payload fields</div>
                    <button type="button" onClick={addField} className="rounded-xl border px-3 py-1 text-xs">+ Add field</button>
                </div>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={`${index}-${field.key}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="field name"
                                value={field.key}
                                onChange={(e) => updateField(index, { key: e.target.value })}
                            />
                            <input
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="value (text/number/true/false/null)"
                                value={field.value}
                                onChange={(e) => updateField(index, { value: e.target.value })}
                            />
                            <button type="button" onClick={() => removeField(index)} className="rounded-xl border border-red-300 px-3 py-2 text-xs text-red-700">Remove</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                    <div className="text-sm font-medium">List response</div>
                    <pre className="h-80 overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
                        {pretty(rows)}
                    </pre>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium">Raw response</div>
                    <pre className="h-80 overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
                        {pretty(responseBody)}
                    </pre>
                </div>
            </div>

            {loading ? <div className="text-sm">Loading...</div> : null}
            {message ? <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-800">{message}</div> : null}
            {error ? <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}
        </div>
    );
}

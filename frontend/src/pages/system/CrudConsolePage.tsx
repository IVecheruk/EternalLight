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
    { key: "organizations", label: "Организации", endpoint: "/api/v1/organizations" },
    { key: "districts", label: "Административные районы", endpoint: "/api/v1/administrative-districts" },
    { key: "streets", label: "Улицы", endpoint: "/api/v1/streets" },
    { key: "lightingObjects", label: "Объекты освещения", endpoint: "/api/v1/lighting-objects" },
    { key: "workActs", label: "Акты работ", endpoint: "/api/v1/work-acts" },
    { key: "workBasisTypes", label: "Основания работ", endpoint: "/api/v1/work-basis-types" },
    { key: "brigadeRoles", label: "Роли бригад", endpoint: "/api/v1/brigade-roles" },
    { key: "faultTypes", label: "Типы неисправностей", endpoint: "/api/v1/fault-types" },
    { key: "uoms", label: "Единицы измерения", endpoint: "/api/v1/uoms" },
    { key: "employees", label: "Сотрудники", endpoint: "/api/v1/employees" },
    { key: "equipmentConditions", label: "Состояния оборудования", endpoint: "/api/v1/equipment-conditions", readOnly: true },
    { key: "workActBasis", label: "Основания актов (укажите workActId в endpoint)", endpoint: "/api/v1/work-acts/1/basis" },
    { key: "workActFaults", label: "Неисправности актов (укажите workActId в endpoint)", endpoint: "/api/v1/work-acts/1/faults" },
    { key: "workActBrigade", label: "Бригада акта (укажите workActId в endpoint)", endpoint: "/api/v1/work-acts/1/brigade" },
    { key: "workActMaterials", label: "Материалы акта (укажите workActId в endpoint)", endpoint: "/api/v1/work-acts/1/materials" },
    { key: "workActLabor", label: "Трудозатраты акта (укажите workActId в endpoint)", endpoint: "/api/v1/work-acts/1/labor-items" },
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
                setMessage(`Загружено записей: ${data.length}.`);
            } else {
                const pageLike = (data ?? {}) as { content?: Record<string, unknown>[] };
                if (Array.isArray(pageLike.content)) {
                    setRows(pageLike.content);
                    setMessage(`Загружено записей: ${pageLike.content.length} (постраничный ответ).`);
                } else {
                    setRows([]);
                    setMessage("Загружен объект.");
                }
            }
        } catch (e: any) {
            setRows([]);
            setResponseBody(null);
            setError(e?.message ?? "Не удалось загрузить");
        } finally {
            setLoading(false);
        }
    };

    const getById = async () => {
        if (!selectedId.trim()) {
            setError("Укажите ID для запроса по ID");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const data = await http<unknown>(joinUrl(endpoint, selectedId, query), { auth: true });
            setResponseBody(data);
            setRows([]);
            setMessage("Объект загружен по ID.");
        } catch (e: any) {
            setError(e?.message ?? "Не удалось получить по ID");
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
            throw new Error("Добавьте хотя бы одно поле");
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
            setMessage("Объект создан.");
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось создать");
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async () => {
        if (resource.readOnly) return;
        if (!selectedId.trim()) {
            setError("Укажите ID для обновления");
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
            setMessage("Объект обновлен.");
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось обновить");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async () => {
        if (resource.readOnly) return;
        if (!selectedId.trim()) {
            setError("Укажите ID для удаления");
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
            setMessage(`Удален id=${selectedId.trim()}`);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось удалить");
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
                <h1 className="text-2xl font-semibold tracking-tight">Консоль CRUD</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Единая рабочая страница для CRUD бэкенда и вложенных эндпоинтов.
                </p>
            </header>

            <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 md:grid-cols-2">
                <label className="space-y-1 text-xs">
                    <span>Набор ресурсов</span>
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
                    <span>Endpoint (редактируемый)</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                    />
                </label>

                <label className="space-y-1 text-xs">
                    <span>Строка запроса</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="page=0&size=20"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>

                <label className="space-y-1 text-xs">
                    <span>ID (для GET/PUT/DELETE)</span>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="ID ресурса"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    />
                </label>

                <div className="col-span-full flex flex-wrap gap-2">
                    <button type="button" onClick={() => void load()} className="rounded-xl border px-4 py-2 text-sm">Загрузить список</button>
                    <button type="button" onClick={() => void getById()} className="rounded-xl border px-4 py-2 text-sm">Получить по ID</button>
                    <button type="button" disabled={resource.readOnly} onClick={() => void createItem()} className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50">Создать</button>
                    <button type="button" disabled={resource.readOnly} onClick={() => void updateItem()} className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50">Обновить</button>
                    <button type="button" disabled={resource.readOnly} onClick={() => void removeItem()} className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 disabled:opacity-50">Удалить</button>
                </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Поля запроса</div>
                    <button type="button" onClick={addField} className="rounded-xl border px-3 py-1 text-xs">+ Добавить поле</button>
                </div>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={`${index}-${field.key}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="имя поля"
                                value={field.key}
                                onChange={(e) => updateField(index, { key: e.target.value })}
                            />
                            <input
                                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                placeholder="значение (текст/число/true/false/null)"
                                value={field.value}
                                onChange={(e) => updateField(index, { value: e.target.value })}
                            />
                            <button type="button" onClick={() => removeField(index)} className="rounded-xl border border-red-300 px-3 py-2 text-xs text-red-700">Удалить</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                    <div className="text-sm font-medium">Ответ списка</div>
                    <pre className="h-80 overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
                        {pretty(rows)}
                    </pre>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium">Сырой ответ</div>
                    <pre className="h-80 overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
                        {pretty(responseBody)}
                    </pre>
                </div>
            </div>

            {loading ? <div className="text-sm">Загрузка...</div> : null}
            {message ? <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-800">{message}</div> : null}
            {error ? <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}
        </div>
    );
}

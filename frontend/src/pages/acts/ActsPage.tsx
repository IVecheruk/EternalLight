import { useEffect, useState } from "react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";
import { Modal } from "@/shared/ui/Modal";
import { workActApi } from "@/entities/work-act/api/workActApi";
import type { WorkAct, WorkActUpsertRequest } from "@/entities/work-act/model/types";
import { organizationApi } from "@/entities/organization/api/organizationApi";
import { lightingObjectApi } from "@/entities/lighting-object/api/lightingObjectApi";
import type { Organization } from "@/entities/organization/model/types";
import type { LightingObject } from "@/entities/lighting-object/model/types";

const blank: WorkActUpsertRequest = {
    actNumber: null,
    actCompiledOn: null,
    actPlace: null,
    executorOrgId: 0,
    structuralUnit: null,
    lightingObjectId: null,
    workStartedAt: null,
    workFinishedAt: null,
    totalDurationMinutes: null,
    actualWorkMinutes: null,
    downtimeMinutes: null,
    downtimeReason: null,
    faultDetails: null,
    faultCause: null,
    qualityRemarks: null,
    otherExpensesAmount: null,
    materialsTotalAmount: null,
    worksTotalAmount: null,
    transportTotalAmount: null,
    grandTotalAmount: null,
    grandTotalInWords: null,
    warrantyWorkMonths: null,
    warrantyWorkStart: null,
    warrantyWorkEnd: null,
    warrantyEquipmentMonths: null,
    warrantyTerms: null,
    copiesCount: null,
    acceptedWithoutRemarks: null,
};

const nowIso = () => new Date().toISOString();

const formatDateTime = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("ru-RU");
};

const toInputDateTime = (value: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromInputDateTime = (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
};

export function ActsPage() {
    const [items, setItems] = useState<WorkAct[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [actNumber, setActNumber] = useState("");
    const [executorOrgId, setExecutorOrgId] = useState<number>(0);

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [lightingObjects, setLightingObjects] = useState<LightingObject[]>([]);

    const [form, setForm] = useState<WorkActUpsertRequest>(blank);
    const [selected, setSelected] = useState<WorkAct | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async (nextPage = page) => {
        setLoading(true);
        setError(null);
        try {
            const [acts, orgs, objects] = await Promise.all([
                workActApi.list({ page: nextPage, size: 10, actNumber: actNumber || undefined, executorOrgId: executorOrgId || undefined }),
                organizationApi.list(),
                lightingObjectApi.list(),
            ]);
            setItems(acts.content);
            setTotalPages(acts.totalPages);
            setTotal(acts.totalElements);
            setPage(acts.number);
            setOrganizations(orgs);
            setLightingObjects(objects);
        } catch (e: any) {
            setError(e?.message ?? "Не удалось загрузить акты.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveCreate = async () => {
        if (!form.executorOrgId) return setError("Нужно выбрать организацию-исполнителя.");
        try {
            setError(null);
            await workActApi.create(form);
            setCreateOpen(false);
            setForm(blank);
            await load(0);
        } catch (e: any) {
            setError(e?.message ?? "Не удалось создать акт.");
        }
    };

    const saveEdit = async () => {
        if (!selected) return;
        if (!form.executorOrgId) return setError("Нужно выбрать организацию-исполнителя.");
        try {
            setError(null);
            await workActApi.update(selected.id, form);
            setEditOpen(false);
            setSelected(null);
            await load(page);
        } catch (e: any) {
            setError(e?.message ?? "Не удалось обновить акт.");
        }
    };

    const buildPayload = (act: WorkAct): WorkActUpsertRequest => {
        const { id: _id, ...payload } = act;
        return payload;
    };

    const updateQuick = async (act: WorkAct, patch: Partial<WorkActUpsertRequest>, fallbackError: string) => {
        try {
            setError(null);
            await workActApi.update(act.id, { ...buildPayload(act), ...patch });
            await load(page);
        } catch (e: any) {
            setError(e?.message ?? fallbackError);
        }
    };

    const startNow = async (act: WorkAct) => {
        if (act.workStartedAt) return;
        await updateQuick(act, { workStartedAt: nowIso() }, "Не удалось установить время начала.");
    };

    const closeNow = async (act: WorkAct) => {
        if (act.workFinishedAt) return;
        if (!confirm("Закрыть акт сейчас?")) return;
        await updateQuick(act, { workFinishedAt: nowIso() }, "Не удалось закрыть акт.");
    };

    const reopenAct = async (act: WorkAct) => {
        if (!act.workFinishedAt) return;
        if (!confirm("Открыть акт снова?")) return;
        await updateQuick(act, { workFinishedAt: null }, "Не удалось открыть акт.");
    };

    const remove = async (id: number) => {
        if (!confirm("Удалить акт?")) return;
        try {
            await workActApi.remove(id);
            await load(page);
        } catch (e: any) {
            setError(e?.message ?? "Не удалось удалить акт.");
        }
    };

    return (
        <PageShell>
            <PageHeader
                title="Акты работ"
                description="Реестр актов с фильтрами, пагинацией и формой создания/редактирования."
                actions={
                    <button
                        type="button"
                        onClick={() => {
                            setForm(blank);
                            setCreateOpen(true);
                        }}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        + Новый акт
                    </button>
                }
            />

            <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
                <input
                    value={actNumber}
                    onChange={(e) => setActNumber(e.target.value)}
                    placeholder="Поиск по номеру акта"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                />
                <select
                    value={executorOrgId}
                    onChange={(e) => setExecutorOrgId(Number(e.target.value))}
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                >
                    <option value={0}>Все организации</option>
                    {organizations.map((o) => (
                        <option key={o.id} value={o.id}>{o.fullName}</option>
                    ))}
                </select>
                <button type="button" onClick={() => void load(0)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm">Применить</button>
            </div>

            {loading ? <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm">Загрузка...</div> : null}
            {!loading && error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div> : null}

            {!loading && !error ? (
                <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                    <div className="border-b border-neutral-200 px-5 py-3 text-sm font-medium">Всего: {total}</div>
                    {items.length === 0 ? (
                        <div className="px-5 py-6 text-sm text-neutral-600">По текущим фильтрам актов нет.</div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {items.map((a) => {
                                const isClosed = !!a.workFinishedAt;

                                return (
                                    <li key={a.id} className="px-5 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 text-sm">
                                                <div className="font-semibold">{a.actNumber || `Акт #${a.id}`}</div>
                                                <div className="text-xs text-neutral-600 mt-1">Дата: {a.actCompiledOn || "—"} • Место: {a.actPlace || "—"}</div>
                                                <div className="text-xs text-neutral-600 mt-1">Начало: {formatDateTime(a.workStartedAt)} • Окончание: {formatDateTime(a.workFinishedAt)}</div>
                                                <div className={`text-xs mt-1 ${isClosed ? "text-emerald-600" : "text-amber-600"}`}>
                                                    Статус: {isClosed ? "Закрыт" : "Открыт"}
                                                </div>
                                                <div className="text-xs text-neutral-600 mt-1">Сумма: {a.grandTotalAmount ?? 0} • Принят: {a.acceptedWithoutRemarks ? "Да" : "Нет"}</div>
                                            </div>
                                            <div className="flex flex-wrap items-start justify-end gap-2">
                                                {!a.workStartedAt && (
                                                    <button
                                                        type="button"
                                                        onClick={() => void startNow(a)}
                                                        className="rounded-xl border border-neutral-200 px-3 py-2 text-xs"
                                                    >
                                                        Начать сейчас
                                                    </button>
                                                )}
                                                {!a.workFinishedAt && (
                                                    <button
                                                        type="button"
                                                        onClick={() => void closeNow(a)}
                                                        className="rounded-xl border border-emerald-200 px-3 py-2 text-xs text-emerald-700"
                                                    >
                                                        Закрыть акт
                                                    </button>
                                                )}
                                                {a.workFinishedAt && (
                                                    <button
                                                        type="button"
                                                        onClick={() => void reopenAct(a)}
                                                        className="rounded-xl border border-neutral-200 px-3 py-2 text-xs"
                                                    >
                                                        Открыть
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelected(a);
                                                        setForm({ ...a });
                                                        setEditOpen(true);
                                                    }}
                                                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs"
                                                >
                                                    Редактировать
                                                </button>
                                                <button type="button" onClick={() => void remove(a.id)} className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-700">Удалить</button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3 text-sm">
                        <button disabled={page <= 0} onClick={() => void load(page - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Назад</button>
                        <span>Страница {page + 1} / {Math.max(totalPages, 1)}</span>
                        <button disabled={page + 1 >= totalPages} onClick={() => void load(page + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Вперед</button>
                    </div>
                </div>
            ) : null}

            <Modal open={createOpen} title="Создание акта" onClose={() => setCreateOpen(false)}>
                <WorkActForm
                    form={form}
                    onChange={setForm}
                    organizations={organizations}
                    lightingObjects={lightingObjects}
                    onCancel={() => setCreateOpen(false)}
                    onSubmit={() => void saveCreate()}
                    submitLabel="Создать"
                />
            </Modal>

            <Modal open={editOpen} title="Редактирование акта" onClose={() => setEditOpen(false)}>
                <WorkActForm
                    form={form}
                    onChange={setForm}
                    organizations={organizations}
                    lightingObjects={lightingObjects}
                    onCancel={() => setEditOpen(false)}
                    onSubmit={() => void saveEdit()}
                    submitLabel="Сохранить"
                />
            </Modal>
        </PageShell>
    );
}

function WorkActForm(props: {
    form: WorkActUpsertRequest;
    onChange: (next: WorkActUpsertRequest) => void;
    organizations: Organization[];
    lightingObjects: LightingObject[];
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
}) {
    const set = (key: keyof WorkActUpsertRequest, value: WorkActUpsertRequest[keyof WorkActUpsertRequest]) =>
        props.onChange({ ...props.form, [key]: value });
    const setDate = (key: keyof WorkActUpsertRequest, value: string) =>
        set(key, value === "" ? null : value);

    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-2">
                <div className="text-sm font-semibold">Основные данные</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Номер акта" value={props.form.actNumber ?? ""} onChange={(v) => set("actNumber", v || null)} />
                    <Field label="Дата акта" value={props.form.actCompiledOn ?? ""} onChange={(v) => setDate("actCompiledOn", v)} type="date" />
                    <Field label="Место" value={props.form.actPlace ?? ""} onChange={(v) => set("actPlace", v || null)} />
                    <Field label="Структурное подразделение" value={props.form.structuralUnit ?? ""} onChange={(v) => set("structuralUnit", v || null)} />
                    <SelectField
                        label="Организация-исполнитель"
                        value={props.form.executorOrgId}
                        onChange={(v) => set("executorOrgId", v)}
                        options={props.organizations.map((o) => ({ value: o.id, label: o.fullName }))}
                        placeholder="Выберите..."
                    />
                    <SelectField
                        label="Объект освещения"
                        value={props.form.lightingObjectId ?? 0}
                        onChange={(v) => set("lightingObjectId", v || null)}
                        options={props.lightingObjects.map((o) => ({ value: o.id, label: `#${o.id} ${o.houseLandmark || ""}`.trim() }))}
                        placeholder="Не задан"
                    />
                    <NumberField
                        label="Количество экземпляров"
                        value={props.form.copiesCount}
                        onChange={(v) => set("copiesCount", v)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-sm font-semibold">Время работ</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DateTimeField
                        label="Начало работ"
                        value={props.form.workStartedAt}
                        onChange={(v) => set("workStartedAt", v)}
                    />
                    <DateTimeField
                        label="Окончание работ"
                        value={props.form.workFinishedAt}
                        onChange={(v) => set("workFinishedAt", v)}
                    />
                    <NumberField
                        label="Общая длительность, мин"
                        value={props.form.totalDurationMinutes}
                        onChange={(v) => set("totalDurationMinutes", v)}
                        step="1"
                    />
                    <NumberField
                        label="Фактическое время, мин"
                        value={props.form.actualWorkMinutes}
                        onChange={(v) => set("actualWorkMinutes", v)}
                        step="1"
                    />
                    <NumberField
                        label="Простой, мин"
                        value={props.form.downtimeMinutes}
                        onChange={(v) => set("downtimeMinutes", v)}
                        step="1"
                    />
                </div>
                <TextArea
                    label="Причина простоя"
                    value={props.form.downtimeReason ?? ""}
                    onChange={(v) => set("downtimeReason", v || null)}
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-semibold">Неисправности</div>
                <TextArea
                    label="Описание неисправности"
                    value={props.form.faultDetails ?? ""}
                    onChange={(v) => set("faultDetails", v || null)}
                />
                <TextArea
                    label="Причина неисправности"
                    value={props.form.faultCause ?? ""}
                    onChange={(v) => set("faultCause", v || null)}
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-semibold">Качество</div>
                <TextArea
                    label="Замечания по качеству"
                    value={props.form.qualityRemarks ?? ""}
                    onChange={(v) => set("qualityRemarks", v || null)}
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-semibold">Суммы</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <NumberField
                        label="Прочие расходы, ₽"
                        value={props.form.otherExpensesAmount}
                        onChange={(v) => set("otherExpensesAmount", v)}
                        step="0.01"
                    />
                    <NumberField
                        label="Материалы, ₽"
                        value={props.form.materialsTotalAmount}
                        onChange={(v) => set("materialsTotalAmount", v)}
                        step="0.01"
                    />
                    <NumberField
                        label="Работы, ₽"
                        value={props.form.worksTotalAmount}
                        onChange={(v) => set("worksTotalAmount", v)}
                        step="0.01"
                    />
                    <NumberField
                        label="Транспорт, ₽"
                        value={props.form.transportTotalAmount}
                        onChange={(v) => set("transportTotalAmount", v)}
                        step="0.01"
                    />
                    <NumberField
                        label="Итого, ₽"
                        value={props.form.grandTotalAmount}
                        onChange={(v) => set("grandTotalAmount", v)}
                        step="0.01"
                    />
                </div>
                <TextArea
                    label="Итого прописью"
                    value={props.form.grandTotalInWords ?? ""}
                    onChange={(v) => set("grandTotalInWords", v || null)}
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-semibold">Гарантия</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <NumberField
                        label="Гарантия на работы, мес"
                        value={props.form.warrantyWorkMonths}
                        onChange={(v) => set("warrantyWorkMonths", v)}
                        step="1"
                    />
                    <Field
                        label="Начало гарантии"
                        value={props.form.warrantyWorkStart ?? ""}
                        onChange={(v) => setDate("warrantyWorkStart", v)}
                        type="date"
                    />
                    <Field
                        label="Конец гарантии"
                        value={props.form.warrantyWorkEnd ?? ""}
                        onChange={(v) => setDate("warrantyWorkEnd", v)}
                        type="date"
                    />
                    <NumberField
                        label="Гарантия на оборудование, мес"
                        value={props.form.warrantyEquipmentMonths}
                        onChange={(v) => set("warrantyEquipmentMonths", v)}
                        step="1"
                    />
                </div>
                <TextArea
                    label="Условия гарантии"
                    value={props.form.warrantyTerms ?? ""}
                    onChange={(v) => set("warrantyTerms", v || null)}
                />
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={!!props.form.acceptedWithoutRemarks}
                    onChange={(e) => set("acceptedWithoutRemarks", e.target.checked)}
                />
                Принят без замечаний
            </label>

            <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={props.onCancel} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm">Отмена</button>
                <button type="button" onClick={props.onSubmit} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white">{props.submitLabel}</button>
            </div>
        </div>
    );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <label className="space-y-1 text-xs">
            <span>{props.label}</span>
            <input type={props.type ?? "text"} value={props.value} onChange={(e) => props.onChange(e.target.value)} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm" />
        </label>
    );
}

function NumberField(props: { label: string; value: number | null; onChange: (v: number | null) => void; step?: string }) {
    return (
        <label className="space-y-1 text-xs">
            <span>{props.label}</span>
            <input
                type="number"
                step={props.step ?? "1"}
                value={props.value ?? ""}
                onChange={(e) => props.onChange(e.target.value === "" ? null : Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
        </label>
    );
}

function TextArea(props: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <label className="space-y-1 text-xs">
            <span>{props.label}</span>
            <textarea
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="min-h-[80px] w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
        </label>
    );
}

function SelectField(props: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    options: { value: number; label: string }[];
    placeholder: string;
}) {
    return (
        <label className="space-y-1 text-xs">
            <span>{props.label}</span>
            <select
                value={props.value}
                onChange={(e) => props.onChange(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            >
                <option value={0}>{props.placeholder}</option>
                {props.options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function DateTimeField(props: { label: string; value: string | null; onChange: (v: string | null) => void }) {
    return (
        <label className="space-y-1 text-xs">
            <span>{props.label}</span>
            <input
                type="datetime-local"
                value={toInputDateTime(props.value)}
                onChange={(e) => props.onChange(fromInputDateTime(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2 pt-1">
                <button
                    type="button"
                    onClick={() => props.onChange(nowIso())}
                    className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px]"
                >
                    Сейчас
                </button>
                <button
                    type="button"
                    onClick={() => props.onChange(null)}
                    className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px]"
                >
                    Очистить
                </button>
            </div>
        </label>
    );
}

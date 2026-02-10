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
                title="Acts"
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
                        + New act
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
                <button type="button" onClick={() => void load(0)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm">Apply</button>
            </div>

            {loading ? <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm">Loading...</div> : null}
            {!loading && error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div> : null}

            {!loading && !error ? (
                <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                    <div className="border-b border-neutral-200 px-5 py-3 text-sm font-medium">Total: {total}</div>
                    {items.length === 0 ? (
                        <div className="px-5 py-6 text-sm text-neutral-600">По текущим фильтрам актов нет.</div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {items.map((a) => (
                                <li key={a.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 text-sm">
                                            <div className="font-semibold">{a.actNumber || `Акт #${a.id}`}</div>
                                            <div className="text-xs text-neutral-600 mt-1">Дата: {a.actCompiledOn || "—"} • Место: {a.actPlace || "—"}</div>
                                            <div className="text-xs text-neutral-600 mt-1">Сумма: {a.grandTotalAmount ?? 0} • Принят: {a.acceptedWithoutRemarks ? "Да" : "Нет"}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelected(a);
                                                    setForm({ ...a });
                                                    setEditOpen(true);
                                                }}
                                                className="rounded-xl border border-neutral-200 px-3 py-2 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => void remove(a.id)} className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-700">Delete</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3 text-sm">
                        <button disabled={page <= 0} onClick={() => void load(page - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Prev</button>
                        <span>Page {page + 1} / {Math.max(totalPages, 1)}</span>
                        <button disabled={page + 1 >= totalPages} onClick={() => void load(page + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-50">Next</button>
                    </div>
                </div>
            ) : null}

            <Modal open={createOpen} title="Create work act" onClose={() => setCreateOpen(false)}>
                <WorkActForm
                    form={form}
                    onChange={setForm}
                    organizations={organizations}
                    lightingObjects={lightingObjects}
                    onCancel={() => setCreateOpen(false)}
                    onSubmit={() => void saveCreate()}
                    submitLabel="Create"
                />
            </Modal>

            <Modal open={editOpen} title="Update work act" onClose={() => setEditOpen(false)}>
                <WorkActForm
                    form={form}
                    onChange={setForm}
                    organizations={organizations}
                    lightingObjects={lightingObjects}
                    onCancel={() => setEditOpen(false)}
                    onSubmit={() => void saveEdit()}
                    submitLabel="Save"
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
    const set = (key: keyof WorkActUpsertRequest, value: any) => props.onChange({ ...props.form, [key]: value });

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Act number" value={props.form.actNumber ?? ""} onChange={(v) => set("actNumber", v || null)} />
                <Field label="Act date" value={props.form.actCompiledOn ?? ""} onChange={(v) => set("actCompiledOn", v || null)} type="date" />
                <Field label="Place" value={props.form.actPlace ?? ""} onChange={(v) => set("actPlace", v || null)} />
                <label className="space-y-1 text-xs"><span>Executor org</span><select value={props.form.executorOrgId} onChange={(e) => set("executorOrgId", Number(e.target.value))} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"><option value={0}>Выбери…</option>{props.organizations.map((o)=><option key={o.id} value={o.id}>{o.fullName}</option>)}</select></label>
                <label className="space-y-1 text-xs"><span>Lighting object</span><select value={props.form.lightingObjectId ?? 0} onChange={(e) => set("lightingObjectId", Number(e.target.value) || null)} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"><option value={0}>Не задан</option>{props.lightingObjects.map((o)=><option key={o.id} value={o.id}>#{o.id} {o.houseLandmark || ""}</option>)}</select></label>
                <Field label="Grand total" value={String(props.form.grandTotalAmount ?? "")} onChange={(v) => set("grandTotalAmount", v === "" ? null : Number(v))} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!props.form.acceptedWithoutRemarks} onChange={(e) => set("acceptedWithoutRemarks", e.target.checked)} /> Принят без замечаний</label>
            <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={props.onCancel} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm">Cancel</button>
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

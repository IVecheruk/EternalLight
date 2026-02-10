import { useEffect, useMemo, useState } from "react";
import { TablePage } from "@/shared/ui/TablePage";
import { Modal } from "@/shared/ui/Modal";
import { lightingObjectApi } from "@/entities/lighting-object/api/lightingObjectApi";
import type { LightingObject, LightingObjectUpsertRequest } from "@/entities/lighting-object/model/types";
import { districtApi } from "@/entities/district/api/districtApi";
import { streetApi } from "@/entities/street/api/streetApi";
import type { District } from "@/entities/district/model/types";
import type { Street } from "@/entities/street/model/types";

const blankForm: LightingObjectUpsertRequest = {
    administrativeDistrictId: 0,
    streetId: 0,
    houseLandmark: null,
    gpsLatitude: null,
    gpsLongitude: null,
    outdoorLineNumber: null,
    controlCabinetNumber: null,
    poleNumber: null,
    luminaireNumber: null,
    equipmentInventoryNumber: null,
};

export function LightingObjectsPage() {
    const [items, setItems] = useState<LightingObject[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [streets, setStreets] = useState<Street[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<LightingObject | null>(null);
    const [form, setForm] = useState<LightingObjectUpsertRequest>(blankForm);

    const districtNames = useMemo(() => new Map(districts.map((d) => [d.id, d.name])), [districts]);
    const streetNames = useMemo(() => new Map(streets.map((s) => [s.id, s.name])), [streets]);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [objects, d, s] = await Promise.all([lightingObjectApi.list(), districtApi.list(), streetApi.list()]);
            setItems(objects);
            setDistricts(d);
            setStreets(s);
        } catch (e: any) {
            setError(e?.message ?? "Не удалось загрузить объекты освещения.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const onCreate = async () => {
        if (form.administrativeDistrictId <= 0 || form.streetId <= 0) {
            setError("Нужно выбрать район и улицу.");
            return;
        }
        try {
            setError(null);
            await lightingObjectApi.create(form);
            setCreateOpen(false);
            setForm(blankForm);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось создать объект.");
        }
    };

    const onUpdate = async () => {
        if (!selected) return;
        if (form.administrativeDistrictId <= 0 || form.streetId <= 0) {
            setError("Нужно выбрать район и улицу.");
            return;
        }
        try {
            setError(null);
            await lightingObjectApi.update(selected.id, form);
            setEditOpen(false);
            setSelected(null);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось обновить объект.");
        }
    };

    const onDelete = async (item: LightingObject) => {
        if (!confirm(`Удалить объект #${item.id}?`)) return;
        try {
            setError(null);
            await lightingObjectApi.remove(item.id);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "Не удалось удалить объект.");
        }
    };

    return (
        <>
            <TablePage
                title="Lighting objects"
                subtitle="Полный CRUD по объектам с привязкой к району/улице и координатам."
                loading={loading}
                error={error}
                actions={
                    <button
                        type="button"
                        onClick={() => {
                            setForm(blankForm);
                            setCreateOpen(true);
                        }}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                    >
                        + New object
                    </button>
                }
            >
                <div className="border-b border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-900">Total: {items.length}</div>
                {items.length === 0 ? (
                    <div className="px-5 py-6 text-sm text-neutral-600">Пока пусто. Создай первый объект освещения.</div>
                ) : (
                    <ul className="divide-y divide-neutral-200">
                        {items.map((o) => (
                            <li key={o.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 text-sm">
                                        <div className="font-semibold text-neutral-900">#{o.id} • {o.houseLandmark ?? "без ориентира"}</div>
                                        <div className="mt-1 text-xs text-neutral-600">
                                            {districtNames.get(o.administrativeDistrictId) ?? `Район #${o.administrativeDistrictId}`} • {streetNames.get(o.streetId) ?? `Улица #${o.streetId}`}
                                        </div>
                                        <div className="mt-1 text-xs text-neutral-600">
                                            GPS: {o.gpsLatitude ?? "—"}, {o.gpsLongitude ?? "—"} • Опора: {o.poleNumber ?? "—"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelected(o);
                                                setForm({ ...o });
                                                setEditOpen(true);
                                            }}
                                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void onDelete(o)}
                                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </TablePage>

            <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create lighting object">
                <LightingObjectForm
                    form={form}
                    onChange={setForm}
                    districts={districts}
                    streets={streets}
                    onCancel={() => setCreateOpen(false)}
                    onSubmit={() => void onCreate()}
                    submitLabel="Create"
                />
            </Modal>

            <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Update lighting object">
                <LightingObjectForm
                    form={form}
                    onChange={setForm}
                    districts={districts}
                    streets={streets}
                    onCancel={() => setEditOpen(false)}
                    onSubmit={() => void onUpdate()}
                    submitLabel="Save"
                />
            </Modal>
        </>
    );
}

function LightingObjectForm(props: {
    form: LightingObjectUpsertRequest;
    onChange: (next: LightingObjectUpsertRequest) => void;
    districts: District[];
    streets: Street[];
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
}) {
    const set = (key: keyof LightingObjectUpsertRequest, value: any) => props.onChange({ ...props.form, [key]: value });

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Select label="District" value={props.form.administrativeDistrictId} onChange={(v) => set("administrativeDistrictId", v)} items={props.districts} />
                <Select label="Street" value={props.form.streetId} onChange={(v) => set("streetId", v)} items={props.streets} />
                <Input label="Landmark" value={props.form.houseLandmark ?? ""} onChange={(v) => set("houseLandmark", v || null)} />
                <Input label="Pole №" value={props.form.poleNumber ?? ""} onChange={(v) => set("poleNumber", v || null)} />
                <Input label="Luminaire №" value={props.form.luminaireNumber ?? ""} onChange={(v) => set("luminaireNumber", v || null)} />
                <Input label="Inventory №" value={props.form.equipmentInventoryNumber ?? ""} onChange={(v) => set("equipmentInventoryNumber", v || null)} />
                <Input label="Latitude" value={String(props.form.gpsLatitude ?? "")} onChange={(v) => set("gpsLatitude", v === "" ? null : Number(v))} />
                <Input label="Longitude" value={String(props.form.gpsLongitude ?? "")} onChange={(v) => set("gpsLongitude", v === "" ? null : Number(v))} />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
                <button type="button" onClick={props.onCancel} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm">Cancel</button>
                <button type="button" onClick={props.onSubmit} className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white">{props.submitLabel}</button>
            </div>
        </div>
    );
}

function Input(props: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <label className="space-y-1 text-xs text-neutral-700">
            <span>{props.label}</span>
            <input
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
            />
        </label>
    );
}

function Select(props: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    items: { id: number; name: string }[];
}) {
    return (
        <label className="space-y-1 text-xs text-neutral-700">
            <span>{props.label}</span>
            <select
                value={props.value}
                onChange={(e) => props.onChange(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
            >
                <option value={0}>Выбери…</option>
                {props.items.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
        </label>
    );
}

import { useCallback, useMemo, useState } from "react";
import { TablePage } from "@/shared/ui/TablePage";
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

type LightingObjectFormProps = {
    initial?: LightingObjectUpsertRequest;
    districts: District[];
    streets: Street[];
    submitLabel: string;
    onSubmit: (data: LightingObjectUpsertRequest) => Promise<void>;
    onDone: () => void;
    onCancel: () => void;
};

function LightingObjectForm({
    initial = blankForm,
    districts,
    streets,
    submitLabel,
    onSubmit,
    onDone,
    onCancel,
}: LightingObjectFormProps) {
    const [form, setForm] = useState<LightingObjectUpsertRequest>({ ...initial });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = (key: keyof LightingObjectUpsertRequest, value: LightingObjectUpsertRequest[keyof LightingObjectUpsertRequest]) =>
        setForm((s) => ({ ...s, [key]: value }));

    const submit = async () => {
        if (form.administrativeDistrictId <= 0 || form.streetId <= 0) {
            setError("Выберите район и улицу.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await onSubmit(form);
            onDone();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось сохранить объект освещения.");
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select
                    label="Район"
                    value={form.administrativeDistrictId}
                    onChange={(v) => set("administrativeDistrictId", v)}
                    items={districts}
                />
                <Select label="Улица" value={form.streetId} onChange={(v) => set("streetId", v)} items={streets} />
                <Input
                    label="Ориентир"
                    value={form.houseLandmark ?? ""}
                    onChange={(v) => set("houseLandmark", v || null)}
                />
                <Input label="Опора №" value={form.poleNumber ?? ""} onChange={(v) => set("poleNumber", v || null)} />
                <Input
                    label="Светильник №"
                    value={form.luminaireNumber ?? ""}
                    onChange={(v) => set("luminaireNumber", v || null)}
                />
                <Input
                    label="Инвентарный №"
                    value={form.equipmentInventoryNumber ?? ""}
                    onChange={(v) => set("equipmentInventoryNumber", v || null)}
                />
                <Input
                    label="Линия НО №"
                    value={form.outdoorLineNumber ?? ""}
                    onChange={(v) => set("outdoorLineNumber", v || null)}
                />
                <Input
                    label="Шкаф управления №"
                    value={form.controlCabinetNumber ?? ""}
                    onChange={(v) => set("controlCabinetNumber", v || null)}
                />
                <Input
                    label="Широта"
                    value={String(form.gpsLatitude ?? "")}
                    onChange={(v) => set("gpsLatitude", v === "" ? null : Number(v))}
                />
                <Input
                    label="Долгота"
                    value={String(form.gpsLongitude ?? "")}
                    onChange={(v) => set("gpsLongitude", v === "" ? null : Number(v))}
                />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                    disabled={loading}
                >
                    Отмена
                </button>
                <button
                    type="button"
                    onClick={() => void submit()}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                    disabled={loading}
                >
                    {loading ? "Сохранение..." : submitLabel}
                </button>
            </div>
        </div>
    );
}

export function LightingObjectsPage() {
    const [districts, setDistricts] = useState<District[]>([]);
    const [streets, setStreets] = useState<Street[]>([]);

    const districtNames = useMemo(() => new Map(districts.map((d) => [d.id, d.name])), [districts]);
    const streetNames = useMemo(() => new Map(streets.map((s) => [s.id, s.name])), [streets]);

    const load = useCallback(async () => {
        const [objects, d, s] = await Promise.all([lightingObjectApi.list(), districtApi.list(), streetApi.list()]);
        setDistricts(d);
        setStreets(s);
        return objects;
    }, []);

    const columns = useMemo(
        () => [
            {
                key: "id",
                header: "ID",
                className: "w-[90px] text-neutral-500",
                render: (o: LightingObject) => `#${o.id}`,
            },
            {
                key: "location",
                header: "Местоположение",
                render: (o: LightingObject) => (
                    <div className="space-y-1 text-xs text-neutral-600">
                        <div className="text-sm font-semibold text-neutral-900">
                            {districtNames.get(o.administrativeDistrictId) ??
                                `Район №${o.administrativeDistrictId}`}
                        </div>
                        <div>
                            {streetNames.get(o.streetId) ?? `Улица №${o.streetId}`} •{" "}
                            {o.houseLandmark ?? "Ориентир не указан"}
                        </div>
                        <div>
                            GPS: {o.gpsLatitude ?? "—"}, {o.gpsLongitude ?? "—"}
                        </div>
                    </div>
                ),
            },
            {
                key: "equipment",
                header: "Оборудование",
                render: (o: LightingObject) => (
                    <div className="space-y-1 text-xs text-neutral-600">
                        <div>Линия НО: {o.outdoorLineNumber ?? "—"}</div>
                        <div>
                            Шкаф: {o.controlCabinetNumber ?? "—"} • Опора: {o.poleNumber ?? "—"} • Светильник:{" "}
                            {o.luminaireNumber ?? "—"}
                        </div>
                        <div>Инвентарный №: {o.equipmentInventoryNumber ?? "—"}</div>
                    </div>
                ),
            },
        ],
        [districtNames, streetNames]
    );

    return (
        <TablePage<LightingObject>
            title="Объекты освещения"
            load={load}
            getRowId={(o) => o.id}
            columns={columns}
            canCreate
            canEdit
            canRemove
            renderCreate={({ onDone, onCancel }) => (
                <LightingObjectForm
                    submitLabel="Создать"
                    districts={districts}
                    streets={streets}
                    onSubmit={async (data) => {
                        await lightingObjectApi.create(data);
                    }}
                    onDone={onDone}
                    onCancel={onCancel}
                />
            )}
            renderEdit={(row, { onDone, onCancel }) => {
                const { id: _id, ...initial } = row;
                return (
                    <LightingObjectForm
                        initial={initial}
                        submitLabel="Сохранить"
                        districts={districts}
                        streets={streets}
                        onSubmit={async (data) => {
                            await lightingObjectApi.update(row.id, data);
                        }}
                        onDone={onDone}
                        onCancel={onCancel}
                    />
                );
            }}
            remove={(o) => lightingObjectApi.remove(o.id)}
        />
    );
}

function Input(props: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <label className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
            <span>{props.label}</span>
            <input
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600"
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
        <label className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
            <span>{props.label}</span>
            <select
                value={props.value}
                onChange={(e) => props.onChange(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600"
            >
                <option value={0}>Выберите...</option>
                {props.items.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

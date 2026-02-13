import { useCallback, useEffect, useMemo, useState } from "react";
import { http } from "@/shared/api/http";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PDF_FONT_NAME = "DejaVuSans";
const PDF_FONT_FILE = "DejaVuSans.ttf";
const PDF_FONT_URL = "/fonts/DejaVuSans.ttf";
let pdfFontBase64Promise: Promise<string> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

async function loadPdfFontBase64(): Promise<string> {
    if (!pdfFontBase64Promise) {
        pdfFontBase64Promise = fetch(PDF_FONT_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load PDF font: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBufferToBase64);
    }
    return pdfFontBase64Promise;
}

function applyPdfFont(doc: jsPDF, fontBase64: string) {
    const fontList = doc.getFontList?.() ?? {};
    const hasFont = Object.prototype.hasOwnProperty.call(fontList, PDF_FONT_NAME);
    if (!hasFont) {
        doc.addFileToVFS(PDF_FONT_FILE, fontBase64);
        doc.addFont(PDF_FONT_FILE, PDF_FONT_NAME, "normal");
    }
    doc.setFont(PDF_FONT_NAME, "normal");
}

type Section = {
    key: string;
    title: string;
    endpoint: string;
    note?: string;
    paged?: { size: number };
};

type SectionState = {
    rows: Record<string, unknown>[];
    raw: unknown;
    loading: boolean;
    error: string | null;
    meta?: { total?: number; note?: string };
};

type DetailSection = {
    key: string;
    title: string;
    getEndpoint: (workActId: number) => string;
    kind: "list" | "object";
};

type DetailState = {
    rows: Record<string, unknown>[];
    raw: unknown;
    loading: boolean;
    error: string | null;
};

const sections: Section[] = [
    { key: "organizations", title: "Организации", endpoint: "/api/v1/organizations" },
    { key: "districts", title: "Административные районы", endpoint: "/api/v1/administrative-districts" },
    { key: "streets", title: "Улицы", endpoint: "/api/v1/streets" },
    { key: "lightingObjects", title: "Объекты освещения", endpoint: "/api/v1/lighting-objects" },
    { key: "employees", title: "Сотрудники", endpoint: "/api/v1/employees" },
    { key: "workActs", title: "Акты работ", endpoint: "/api/v1/work-acts", paged: { size: 200 } },
    { key: "workBasisTypes", title: "Основания работ", endpoint: "/api/v1/work-basis-types" },
    { key: "brigadeRoles", title: "Роли бригад", endpoint: "/api/v1/brigade-roles" },
    { key: "faultTypes", title: "Типы неисправностей", endpoint: "/api/v1/fault-types" },
    { key: "uoms", title: "Единицы измерения", endpoint: "/api/v1/uoms" },
    { key: "equipmentConditions", title: "Состояния оборудования", endpoint: "/api/v1/equipment-conditions" },
];

const workActDetails: DetailSection[] = [
    { key: "approval", title: "Согласование", getEndpoint: (id) => `/api/v1/work-acts/${id}/approval`, kind: "object" },
    { key: "basis", title: "Основание", getEndpoint: (id) => `/api/v1/work-acts/${id}/basis`, kind: "list" },
    { key: "faults", title: "Неисправности", getEndpoint: (id) => `/api/v1/work-acts/${id}/faults`, kind: "list" },
    { key: "brigade", title: "Бригада", getEndpoint: (id) => `/api/v1/work-acts/${id}/brigade`, kind: "list" },
    { key: "materials", title: "Материалы", getEndpoint: (id) => `/api/v1/work-acts/${id}/materials`, kind: "list" },
    { key: "laborItems", title: "Трудозатраты", getEndpoint: (id) => `/api/v1/work-acts/${id}/labor-items`, kind: "list" },
    { key: "performedWorks", title: "Выполненные работы", getEndpoint: (id) => `/api/v1/work-acts/${id}/performed-works`, kind: "list" },
    { key: "equipmentUsage", title: "Использование оборудования", getEndpoint: (id) => `/api/v1/work-acts/${id}/equipment-usage`, kind: "list" },
    { key: "installedEquipment", title: "Установленное оборудование", getEndpoint: (id) => `/api/v1/work-acts/${id}/installed-equipment`, kind: "list" },
    { key: "dismantledEquipment", title: "Демонтированное оборудование", getEndpoint: (id) => `/api/v1/work-acts/${id}/dismantled-equipment`, kind: "list" },
];

function formatCell(value: unknown): string {
    if (value === null || value === undefined) return "—";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
}

function extractRows(data: unknown): {
    rows: Record<string, unknown>[];
    meta?: { total?: number; note?: string };
    totalPages?: number;
} {
    if (Array.isArray(data)) return { rows: data as Record<string, unknown>[] };

    if (data && typeof data === "object") {
        const maybePage = data as {
            content?: Record<string, unknown>[];
            totalElements?: number;
            totalPages?: number;
        };
        if (Array.isArray(maybePage.content)) {
            return {
                rows: maybePage.content,
                meta: {
                    total: typeof maybePage.totalElements === "number" ? maybePage.totalElements : undefined,
                    note: "Постраничный ответ",
                },
                totalPages: typeof maybePage.totalPages === "number" ? maybePage.totalPages : undefined,
            };
        }
    }

    return { rows: [] };
}

function collectColumns(rows: Record<string, unknown>[]) {
    const columns = new Set<string>();
    rows.forEach((row) => Object.keys(row).forEach((key) => columns.add(key)));
    return Array.from(columns);
}

export function AllDataPage() {
    const initialState = useMemo(
        () =>
            Object.fromEntries(
                sections.map((section) => [
                    section.key,
                    { rows: [], raw: null, loading: true, error: null } satisfies SectionState,
                ])
            ) as Record<string, SectionState>,
        []
    );

    const detailInitial = useMemo(
        () =>
            Object.fromEntries(
                workActDetails.map((section) => [
                    section.key,
                    { rows: [], raw: null, loading: false, error: null } satisfies DetailState,
                ])
            ) as Record<string, DetailState>,
        []
    );

    const [state, setState] = useState<Record<string, SectionState>>(initialState);
    const [detailState, setDetailState] = useState<Record<string, DetailState>>(detailInitial);
    const [workActId, setWorkActId] = useState("");
    const [detailsLoadedFor, setDetailsLoadedFor] = useState<number | null>(null);
    const [exporting, setExporting] = useState(false);

    const updateSection = useCallback((key: string, patch: Partial<SectionState>) => {
        setState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    }, []);

    const updateDetails = useCallback((key: string, patch: Partial<DetailState>) => {
        setDetailState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    }, []);

    const loadSection = useCallback(
        async (section: Section) => {
            updateSection(section.key, { loading: true, error: null });
            try {
                if (section.paged) {
                    const pageSize = section.paged.size;
                    const buildUrl = (page: number) => `${section.endpoint}?page=${page}&size=${pageSize}`;
                    const first = await http<unknown>(buildUrl(0), { auth: true });
                    const extractedFirst = extractRows(first);
                    const allRows = [...extractedFirst.rows];
                    const totalPages = extractedFirst.totalPages ?? 1;

                    for (let page = 1; page < totalPages; page += 1) {
                        const data = await http<unknown>(buildUrl(page), { auth: true });
                        const extracted = extractRows(data);
                        allRows.push(...extracted.rows);
                    }

                    updateSection(section.key, {
                        rows: allRows,
                        raw: first,
                        meta: {
                            total: extractedFirst.meta?.total ?? allRows.length,
                            note: `pages=${totalPages}, size=${pageSize}`,
                        },
                        loading: false,
                    });
                    return;
                }

                const data = await http<unknown>(section.endpoint, { auth: true });
                const { rows, meta } = extractRows(data);
                updateSection(section.key, { rows, raw: data, meta, loading: false });
            } catch (e) {
                updateSection(section.key, {
                    rows: [],
                    raw: null,
                    meta: undefined,
                    loading: false,
                    error: e instanceof Error ? e.message : "Не удалось загрузить",
                });
            }
        },
        [updateSection]
    );

    const loadAll = useCallback(async () => {
        await Promise.all(sections.map((section) => loadSection(section)));
    }, [loadSection]);

    const loadWorkActDetails = useCallback(async () => {
        const id = Number(workActId);
        if (!Number.isFinite(id) || id <= 0) return;

        setDetailsLoadedFor(id);
        await Promise.all(
            workActDetails.map(async (detail) => {
                updateDetails(detail.key, { loading: true, error: null });
                try {
                    const data = await http<unknown>(detail.getEndpoint(id), { auth: true });
                    const rows = detail.kind === "list" ? extractRows(data).rows : [];
                    updateDetails(detail.key, { raw: data, rows, loading: false });
                } catch (e) {
                    updateDetails(detail.key, {
                        raw: null,
                        rows: [],
                        loading: false,
                        error: e instanceof Error ? e.message : "Не удалось загрузить",
                    });
                }
            })
        );
    }, [updateDetails, workActId]);

    const clearWorkActDetails = useCallback(() => {
        setDetailsLoadedFor(null);
        setDetailState(detailInitial);
    }, [detailInitial]);

    useEffect(() => {
        void loadAll();
    }, [loadAll]);

    const anyLoading = useMemo(
        () => Object.values(state).some((section) => section.loading) || exporting,
        [state, exporting]
    );

    const exportPdf = useCallback(async () => {
        setExporting(true);
        try {
            const fontBase64 = await loadPdfFontBase64().catch((error) => {
                console.error("Failed to load PDF font", error);
                return null;
            });
            const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
            const tableFont = fontBase64 ? PDF_FONT_NAME : "helvetica";
            if (fontBase64) {
                applyPdfFont(doc, fontBase64);
            } else {
                doc.setFont(tableFont, "normal");
            }
            const pageHeight = doc.internal.pageSize.getHeight();
            let cursorY = 40;

            doc.setFont(tableFont, "normal");
            doc.setFontSize(16);
            doc.text("Сводные данные БД", 40, cursorY);
            cursorY += 24;

            const addSection = (title: string, rows: Record<string, unknown>[], note?: string) => {
                doc.setFont(tableFont, "normal");
                doc.setFontSize(12);
                doc.text(title, 40, cursorY);
                cursorY += 12;

                if (note) {
                    doc.setFont(tableFont, "normal");
                    doc.setFontSize(9);
                    doc.text(note, 40, cursorY);
                    cursorY += 10;
                }

                if (!rows.length) {
                    doc.setFont(tableFont, "normal");
                    doc.setFontSize(9);
                    doc.text("Нет данных", 40, cursorY);
                    cursorY += 12;
                    return;
                }

                const columns = collectColumns(rows);
                const body = rows.map((row) => columns.map((col) => formatCell(row[col])));
                autoTable(doc, {
                    startY: cursorY,
                    head: [columns],
                    body,
                    styles: { font: tableFont, fontSize: 8, cellPadding: 3 },
                    headStyles: { font: tableFont, fillColor: [23, 23, 23], textColor: 255 },
                });

                const lastTable = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable;
                cursorY = lastTable?.finalY ? lastTable.finalY + 20 : cursorY + 20;
                if (cursorY > pageHeight - 80) {
                    doc.addPage();
                    cursorY = 40;
                }
            };

            sections.forEach((section) => {
                const sectionState = state[section.key];
                const note = sectionState?.meta?.total
                    ? `Всего: ${sectionState.meta.total}`
                    : section.note ?? sectionState?.meta?.note;
                addSection(section.title, sectionState?.rows ?? [], note);
            });

            if (detailsLoadedFor) {
                doc.setFont(tableFont, "normal");
                doc.setFontSize(12);
                doc.text(`Детали акта: ID ${detailsLoadedFor}`, 40, cursorY);
                cursorY += 16;

                workActDetails.forEach((detail) => {
                    const detailRows = detailState[detail.key]?.rows ?? [];
                    const detailNote =
                        detail.kind === "object" && detailState[detail.key]?.raw
                            ? JSON.stringify(detailState[detail.key]?.raw)
                            : undefined;
                    addSection(detail.title, detailRows, detailNote);
                });
            }

            doc.save("eternal-light-db-export.pdf");
        } finally {
            setExporting(false);
        }
    }, [detailState, detailsLoadedFor, state]);

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Сводные данные БД</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Полный список основных таблиц и связанных данных из API бэкенда.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void loadAll()}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                        disabled={anyLoading}
                    >
                        Обновить все
                    </button>
                    <button
                        type="button"
                        onClick={exportPdf}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        disabled={anyLoading}
                    >
                        {exporting ? "Экспортируем..." : "Экспорт в PDF"}
                    </button>
                </div>
            </header>

            <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Детали акта</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        Укажите ID акта, чтобы подгрузить связанные таблицы.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={workActId}
                        onChange={(e) => setWorkActId(e.target.value)}
                        placeholder="ID акта"
                        className="w-44 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    />
                    <button
                        type="button"
                        onClick={() => void loadWorkActDetails()}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        disabled={!workActId.trim()}
                    >
                        Загрузить детали
                    </button>
                    <button
                        type="button"
                        onClick={clearWorkActDetails}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                        disabled={!detailsLoadedFor}
                    >
                        Сбросить
                    </button>
                </div>

                {detailsLoadedFor && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {workActDetails.map((detail) => {
                            const dState = detailState[detail.key];
                            const rows = dState.rows ?? [];
                            const columns = collectColumns(rows);
                            return (
                                <div
                                    key={detail.key}
                                    className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{detail.title}</div>
                                        {dState.loading ? (
                                            <span className="text-xs text-neutral-500">Загрузка...</span>
                                        ) : null}
                                    </div>
                                    {dState.error ? (
                                        <div className="text-xs text-red-600">{dState.error}</div>
                                    ) : detail.kind === "object" && dState.raw ? (
                                        <pre className="max-h-48 overflow-auto rounded-xl bg-neutral-50 p-2 text-xs dark:bg-neutral-900">
                                            {JSON.stringify(dState.raw, null, 2)}
                                        </pre>
                                    ) : rows.length ? (
                                        <div className="overflow-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                                            <table className="min-w-full text-left text-xs">
                                                <thead className="bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                                                    <tr>
                                                        {columns.map((col) => (
                                                            <th key={col} className="px-3 py-2 font-medium">
                                                                {col}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows.map((row, idx) => (
                                                        <tr
                                                            key={row.id ? String(row.id) : `${detail.key}-${idx}`}
                                                            className="border-t border-neutral-200 dark:border-neutral-800"
                                                        >
                                                            {columns.map((col) => (
                                                                <td
                                                                    key={col}
                                                                    className="px-3 py-2 align-top text-neutral-700 dark:text-neutral-200"
                                                                >
                                                                    {formatCell(row[col])}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-neutral-500">Нет данных</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {sections.map((section) => {
                const sectionState = state[section.key];
                const rows = sectionState?.rows ?? [];
                const columns = collectColumns(rows);
                return (
                    <section
                        key={section.key}
                        className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">{section.title}</h2>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                    Всего: {rows.length}
                                    {sectionState?.meta?.total ? ` / ${sectionState.meta.total}` : ""}
                                    {section.note ? ` • ${section.note}` : ""}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => void loadSection(section)}
                                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                                disabled={sectionState?.loading}
                            >
                                Обновить
                            </button>
                        </div>

                        {sectionState?.loading ? (
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
                                Загружаем...
                            </div>
                        ) : sectionState?.error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                {sectionState.error}
                            </div>
                        ) : rows.length === 0 ? (
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                                Нет данных
                            </div>
                        ) : (
                            <div className="overflow-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                                <table className="min-w-full text-left text-xs">
                                    <thead className="bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            {columns.map((col) => (
                                                <th key={col} className="px-3 py-2 font-medium">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, idx) => (
                                            <tr
                                                key={row.id ? String(row.id) : `${section.key}-${idx}`}
                                                className="border-t border-neutral-200 dark:border-neutral-800"
                                            >
                                                {columns.map((col) => (
                                                    <td key={col} className="px-3 py-2 align-top text-neutral-700 dark:text-neutral-200">
                                                        {formatCell(row[col])}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}

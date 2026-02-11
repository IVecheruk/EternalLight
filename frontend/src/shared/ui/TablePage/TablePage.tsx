import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/shared/ui/Modal";

export type Column<Row> = {
    key: string;
    header: string;
    render: (row: Row) => React.ReactNode;
    className?: string;
};

type Props<Row> = {
    title: string;
    subtitle?: string;

    // data
    load: () => Promise<Row[]>;
    getRowId: (row: Row) => string | number;

    // table
    columns: Column<Row>[];

    // actions
    canCreate?: boolean;
    canEdit?: boolean;
    canRemove?: boolean;

    renderCreate?: (opts: { onDone: () => void; onCancel: () => void }) => React.ReactNode;
    renderEdit?: (row: Row, opts: { onDone: () => void; onCancel: () => void }) => React.ReactNode;
    remove?: (row: Row) => Promise<void>;
};

export function TablePage<Row>(props: Props<Row>) {
    const {
        title,
        subtitle,
        load,
        getRowId,
        columns,
        canCreate = true,
        canEdit = true,
        canRemove = true,
        renderCreate,
        renderEdit,
        remove,
    } = props;

    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editRow, setEditRow] = useState<Row | null>(null);

    const hasActions = useMemo(() => canEdit || canRemove, [canEdit, canRemove]);

    const reload = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await load();
            setRows(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось загрузить данные");
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRemove = async (row: Row) => {
        if (!remove) return;
        if (!confirm("Удалить запись?")) return;
        try {
            setLoading(true);
            await remove(row);
            await reload();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось удалить");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {subtitle && <p className="text-sm text-neutral-600 dark:text-neutral-300">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void reload()}
                        disabled={loading}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                    >
                        {loading ? "Загрузка..." : "Обновить"}
                    </button>

                    {canCreate && renderCreate && (
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        >
                            + Добавить
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300">
                        <tr>
                            {columns.map((c) => (
                                <th key={c.key} className={`px-4 py-3 font-semibold ${c.className ?? ""}`}>
                                    {c.header}
                                </th>
                            ))}
                            {hasActions && <th className="px-4 py-3 font-semibold">Действия</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row) => (
                            <tr
                                key={String(getRowId(row))}
                                className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-900"
                            >
                                {columns.map((c) => (
                                    <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                                        {c.render(row)}
                                    </td>
                                ))}

                                {hasActions && (
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            {canEdit && renderEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => setEditRow(row)}
                                                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                                                >
                                                    Редактировать
                                                </button>
                                            )}
                                            {canRemove && remove && (
                                                <button
                                                    type="button"
                                                    onClick={() => void onRemove(row)}
                                                    className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs text-red-700 hover:bg-red-50 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                                                >
                                                    Удалить
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}

                        {!loading && rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + (hasActions ? 1 : 0)}
                                    className="px-4 py-10 text-center text-sm text-neutral-500"
                                >
                                    Нет данных
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create modal */}
            <Modal open={createOpen} title={`Создать: ${title}`} onClose={() => setCreateOpen(false)}>
                {renderCreate?.({
                    onDone: async () => {
                        setCreateOpen(false);
                        await reload();
                    },
                    onCancel: () => setCreateOpen(false),
                })}
            </Modal>

            {/* Edit modal */}
            <Modal open={!!editRow} title={`Редактировать: ${title}`} onClose={() => setEditRow(null)}>
                {editRow &&
                    renderEdit?.(editRow, {
                        onDone: async () => {
                            setEditRow(null);
                            await reload();
                        },
                        onCancel: () => setEditRow(null),
                    })}
            </Modal>
        </div>
    );
}

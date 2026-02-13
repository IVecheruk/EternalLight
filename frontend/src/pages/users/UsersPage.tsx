import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";
import { Modal } from "@/shared/ui/Modal";
import { userApi, type SystemUser } from "@/entities/user/api/userApi";
import { useAuth } from "@/features/auth/model/useAuth";
import { SYSTEM_ROLES, normalizeRoleName, parseAuthorities } from "@/features/permissions/model/roles";

const ROLE_LABELS: Record<string, string> = {
    [SYSTEM_ROLES.SUPER_ADMIN]: "Супер администратор",
    [SYSTEM_ROLES.ADMIN]: "Администратор",
    [SYSTEM_ROLES.TECHNICIAN]: "Техник",
    [SYSTEM_ROLES.USER]: "Пользователь",
};

const ROLE_OPTIONS = [
    SYSTEM_ROLES.USER,
    SYSTEM_ROLES.TECHNICIAN,
    SYSTEM_ROLES.ADMIN,
    SYSTEM_ROLES.SUPER_ADMIN,
];

function resolveRole(user: SystemUser): string {
    const rawRoles = [
        ...(user.roles ?? []),
        ...(user.role ? [user.role] : []),
        ...parseAuthorities(user.authorities),
    ];

    for (const raw of rawRoles) {
        const normalized = normalizeRoleName(raw);
        if (normalized) return normalized;
    }

    return "";
}

function roleLabel(role: string) {
    if (!role) return "Не назначена";
    return ROLE_LABELS[role] ?? role;
}

export function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [draftRoles, setDraftRoles] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [statusId, setStatusId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [blockTarget, setBlockTarget] = useState<SystemUser | null>(null);
    const [blockReason, setBlockReason] = useState("");
    const [blockError, setBlockError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userApi.list();
            setUsers(data);
            const nextDraft: Record<number, string> = {};
            data.forEach((u) => {
                nextDraft[u.id] = resolveRole(u);
            });
            setDraftRoles(nextDraft);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось загрузить пользователей.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    useEffect(() => {
        const id = window.setInterval(() => {
            if (loading || savingId !== null || statusId !== null || blockTarget) return;
            void load();
        }, 10000);
        return () => window.clearInterval(id);
    }, [load, loading, savingId, statusId, blockTarget]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return users.filter((u) => {
            const email = u.email?.toLowerCase() ?? "";
            const name = u.fullName?.toLowerCase() ?? "";
            const currentRole = resolveRole(u);
            const matchesQuery = !q || email.includes(q) || name.includes(q);
            const matchesRole = roleFilter === "all" || currentRole === roleFilter;
            const isActive = u.active !== false;
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "blocked" && !isActive);
            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [query, users, roleFilter, statusFilter]);

    const setRole = (id: number, role: string) => {
        setDraftRoles((prev) => ({ ...prev, [id]: role }));
    };

    const saveRole = async (u: SystemUser) => {
        const currentRole = resolveRole(u);
        const selected = draftRoles[u.id] ?? currentRole;
        if (!selected) {
            setError("Выберите роль перед сохранением.");
            return;
        }
        try {
            setSavingId(u.id);
            setError(null);
            await userApi.updateRole(u.id, selected);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось обновить роль.");
        } finally {
            setSavingId(null);
        }
    };

    const toggleStatus = async (u: SystemUser, nextActive: boolean) => {
        try {
            setStatusId(u.id);
            setError(null);
            await userApi.updateStatus(u.id, nextActive);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось обновить статус.");
        } finally {
            setStatusId(null);
        }
    };

    const openBlock = (u: SystemUser) => {
        setBlockTarget(u);
        setBlockReason("");
        setBlockError(null);
    };

    const confirmBlock = async () => {
        if (!blockTarget) return;
        const reason = blockReason.trim();
        if (!reason) {
            setBlockError("Укажите причину.");
            return;
        }
        try {
            setStatusId(blockTarget.id);
            setBlockError(null);
            await userApi.updateStatus(blockTarget.id, false, reason);
            await load();
            setBlockTarget(null);
            setBlockReason("");
        } catch (e) {
            setBlockError(e instanceof Error ? e.message : "Не удалось заблокировать пользователя.");
        } finally {
            setStatusId(null);
        }
    };

    return (
        <PageShell>
            <PageHeader
                title="Роли пользователей"
                description="Супер администратор может назначать роли зарегистрированным пользователям."
                actions={
                    <button
                        type="button"
                        onClick={() => void load()}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                        disabled={loading}
                    >
                        {loading ? "Загрузка..." : "Обновить"}
                    </button>
                }
            />

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск по почте или имени"
                        className="w-64 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="all">Все роли</option>
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                                {roleLabel(role)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <option value="all">Все статусы</option>
                        <option value="active">Активные</option>
                        <option value="blocked">Заблокированные</option>
                    </select>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Пользователей: {filtered.length}
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900/40 dark:text-neutral-400">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Эл. почта</th>
                                <th className="px-4 py-3 font-semibold">Имя</th>
                                <th className="px-4 py-3 font-semibold">Текущая роль</th>
                                <th className="px-4 py-3 font-semibold">Статус</th>
                                <th className="px-4 py-3 font-semibold">Назначить роль</th>
                                <th className="px-4 py-3 text-right font-semibold">Действие</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filtered.length ? (
                                filtered.map((u) => {
                                    const currentRole = resolveRole(u);
                                    const selected = draftRoles[u.id] ?? currentRole;
                                    const isDirty = !!selected && selected !== currentRole;
                                    const isSaving = savingId === u.id;
                                    const isSelf = currentUser?.id === u.id;
                                    const hasUnknownRole =
                                        !!currentRole && !ROLE_OPTIONS.includes(currentRole as typeof ROLE_OPTIONS[number]);
                                    const needsRole = !currentRole || currentRole === SYSTEM_ROLES.USER;
                                    const isActive = u.active !== false;
                                    const isStatusBusy = statusId === u.id;

                                    return (
                                        <tr key={u.id} className="text-neutral-700 dark:text-neutral-200">
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div className="flex items-center gap-2">
                                                    <span>{u.email}</span>
                                                    {needsRole ? (
                                                        <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold uppercase text-red-700">
                                                            новый
                                                        </span>
                                                    ) : null}
                                                    {!isActive ? (
                                                        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold uppercase text-rose-700">
                                                            заблокирован
                                                        </span>
                                                    ) : null}
                                                    {isSelf ? (
                                                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                            Вы
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {u.fullName ?? "-"}
                                            </td>
                                            <td className="px-4 py-3">{roleLabel(currentRole)}</td>
                                            <td className="px-4 py-3">
                                                {isActive ? (
                                                    <span className="text-xs font-semibold text-emerald-700">Активен</span>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-semibold text-rose-700">Заблокирован</span>
                                                        {u.blockedReason ? (
                                                            <div className="text-[11px] text-neutral-500">
                                                                {u.blockedReason}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={selected}
                                                    onChange={(e) => setRole(u.id, e.target.value)}
                                                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                                                >
                                                    <option value="">Не назначена</option>
                                                    {hasUnknownRole ? (
                                                        <option value={currentRole}>{roleLabel(currentRole)}</option>
                                                    ) : null}
                                                    {ROLE_OPTIONS.map((role) => (
                                                        <option key={role} value={role}>
                                                            {roleLabel(role)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => void saveRole(u)}
                                                        className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-black disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                                                        disabled={!isDirty || isSaving}
                                                    >
                                                        {isSaving ? "Сохранение..." : "Сохранить"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            if (isActive) {
                                                                openBlock(u);
                                                            } else {
                                                                if (!confirm("Разблокировать пользователя?")) return;
                                                                await toggleStatus(u, true);
                                                            }
                                                        }}
                                                        className={[
                                                            "rounded-xl px-3 py-2 text-xs font-medium",
                                                            isActive
                                                                ? "border border-red-200 text-red-700 hover:bg-red-50"
                                                                : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50",
                                                            isSelf ? "opacity-40 pointer-events-none" : "",
                                                        ].join(" ")}
                                                        disabled={isStatusBusy}
                                                        title={isSelf ? "Нельзя блокировать себя" : undefined}
                                                    >
                                                        {isStatusBusy ? "Обновление..." : isActive ? "Заблокировать" : "Разблокировать"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400"
                                    >
                                        {loading ? "Загрузка..." : "Пользователи не найдены."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={!!blockTarget}
                title={blockTarget ? `Заблокировать ${blockTarget.email}` : "Заблокировать пользователя"}
                onClose={() => setBlockTarget(null)}
            >
                <div className="space-y-3 text-sm">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                        Блокировка отключит доступ и сбросит роль пользователя на "Пользователь".
                    </div>
                    <label className="space-y-1 text-xs">
                        <span>Причина блокировки</span>
                        <textarea
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            placeholder="Причина..."
                            className="min-h-[96px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                        />
                    </label>
                    {blockError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                            {blockError}
                        </div>
                    ) : null}
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setBlockTarget(null)}
                            className="rounded-xl border border-neutral-200 px-4 py-2 text-xs hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            onClick={() => void confirmBlock()}
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                            Заблокировать пользователя
                        </button>
                    </div>
                </div>
            </Modal>
        </PageShell>
    );
}

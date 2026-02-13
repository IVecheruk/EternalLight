import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/model/useAuth";
import { TextField } from "@/shared/ui/TextField";

type FormState = {
    fullName: string;
    address: string;
    birthDate: string;
    phone: string;
    notificationEmail: string;
};

export function ProfilePage() {
    const { isReady, isAuthenticated, user, refreshMe } = useAuth();
    const [form, setForm] = useState<FormState>({
        fullName: "",
        address: "",
        birthDate: "",
        phone: "",
        notificationEmail: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;
        setForm({
            fullName: user.fullName ?? "",
            address: user.address ?? "",
            birthDate: user.birthDate ?? "",
            phone: user.phone ?? "",
            notificationEmail: user.notificationEmail ?? user.email ?? "",
        });
    }, [user]);

    const roleText = useMemo(() => {
        if (user?.roles?.length) return user.roles.join(", ");
        if (user?.role) return user.role;
        if (user?.authorities) return user.authorities;
        return "Не назначена (назначит администратор)";
    }, [user]);

    const updateField = (key: keyof FormState, value: string) => {
        setSaved(false);
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSaved(false);

            await authApi.updateProfile({
                fullName: form.fullName.trim() || null,
                address: form.address.trim() || null,
                birthDate: form.birthDate || null,
                phone: form.phone.trim() || null,
                notificationEmail: form.notificationEmail.trim() || null,
            });
            await refreshMe();
            setSaved(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось обновить профиль.");
        } finally {
            setSaving(false);
        }
    };

    if (!isReady) return <div className="text-sm text-neutral-600">Загрузка...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Профиль</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    Личный кабинет пользователя.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-xs font-semibold text-neutral-500">Эл. почта</div>
                    <div className="mt-1 text-sm">{user?.email ?? "—"}</div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-xs font-semibold text-neutral-500">Роль</div>
                    <div className="mt-1 text-sm">{roleText}</div>
                </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold">Личные данные</div>
                        <div className="text-xs text-neutral-500">Обновите личную информацию.</div>
                    </div>

                    <button
                        type="button"
                        onClick={() => void onSave()}
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                        disabled={saving}
                    >
                        {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {error}
                    </div>
                )}

                {saved && !error && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        Сохранено.
                    </div>
                )}

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextField
                        label="ФИО"
                        value={form.fullName}
                        placeholder="Иванов Иван Иванович"
                        onChange={(v) => updateField("fullName", v)}
                    />

                    <TextField
                        label="Телефон"
                        value={form.phone}
                        placeholder="+7 900 000 00 00"
                        onChange={(v) => updateField("phone", v)}
                        type="tel"
                    />

                    <TextField
                        label="Почта для уведомлений"
                        value={form.notificationEmail}
                        placeholder="почта@example.ru"
                        onChange={(v) => updateField("notificationEmail", v)}
                        type="email"
                    />

                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Адрес
                        </label>
                        <textarea
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Город, улица, дом"
                            className="mt-2 min-h-[96px] w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Дата рождения
                        </label>
                        <input
                            type="date"
                            value={form.birthDate}
                            onChange={(e) => updateField("birthDate", e.target.value)}
                            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

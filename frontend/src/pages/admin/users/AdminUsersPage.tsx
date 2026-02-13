import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";

export function AdminUsersPage() {
    return (
        <PageShell>
            <PageHeader
                title="Админ • Пользователи"
                description="Глобальное управление пользователями, членством и ролями. Доступно только SUPER_ADMIN."
            />

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                Здесь будет список пользователей, привязка к организациям и назначение ролей.
            </div>
        </PageShell>
    );
}

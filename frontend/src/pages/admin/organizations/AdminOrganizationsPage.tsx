import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";

export function AdminOrganizationsPage() {
    return (
        <PageShell>
            <PageHeader
                title="Админ • Организации"
                description="Управление тенантами (создание, блокировка, план тарифа, лимиты). Доступно только SUPER_ADMIN."
            />

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                Здесь будет таблица организаций и операции SaaS-администрирования.
            </div>
        </PageShell>
    );
}

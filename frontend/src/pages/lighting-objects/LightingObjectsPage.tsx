import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";
import { EmptyState } from "@/shared/ui/EmptyState";

export function LightingObjectsPage() {
    return (
        <PageShell>
            <PageHeader
                title="Lighting objects"
                description="Объекты уличного освещения. Позже: карточки/таблица, статус, координаты, привязка к улице."
                actions={
                    <Link
                        to="/acts"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                    >
                        Go to Acts
                    </Link>
                }
            />

            <EmptyState
                title="Заглушка страницы"
                description="Следом сделаем CRUD: список → карточка объекта → редактирование."
                action={
                    <button
                        type="button"
                        disabled
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
                    >
                        + Add object (soon)
                    </button>
                }
            />
        </PageShell>
    );
}

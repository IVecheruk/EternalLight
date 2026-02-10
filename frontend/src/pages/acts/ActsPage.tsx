import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";
import { EmptyState } from "@/shared/ui/EmptyState";

export function ActsPage() {
    return (
        <PageShell>
            <PageHeader
                title="Acts"
                description="Акты работ. Позже: мастер создания акта, статусы, участники, вложения и печать."
                actions={
                    <Link
                        to="/"
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                    >
                        Home
                    </Link>
                }
            />

            <EmptyState
                title="Каркас готов"
                description="Следующим шагом соберём UI: список актов + создание нового акта (wizard)."
                action={
                    <button
                        type="button"
                        disabled
                        className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
                    >
                        + New act (soon)
                    </button>
                }
            />
        </PageShell>
    );
}

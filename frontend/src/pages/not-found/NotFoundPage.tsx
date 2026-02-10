import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageShell } from "@/shared/ui/PageShell";
import { EmptyState } from "@/shared/ui/EmptyState";

export function NotFoundPage() {
    return (
        <PageShell>
            <PageHeader title="404" description="Такой страницы нет." />

            <EmptyState
                title="Страница не найдена"
                description="Проверь адрес или вернись на главную."
                action={
                    <Link
                        to="/"
                        className="inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
                    >
                        Go to Home
                    </Link>
                }
            />
        </PageShell>
    );
}

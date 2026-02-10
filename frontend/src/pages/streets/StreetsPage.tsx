import { PageShell } from "@/shared/ui/PageShell";

export const StreetsPage = () => {
    return (
        <PageShell title="Streets" description="Справочник улиц (UI готов, API позже).">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
                Тут будет таблица + фильтр по району.
            </div>
        </PageShell>
    );
};

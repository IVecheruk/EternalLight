import { PageShell } from "@/shared/ui/PageShell";

export const ActsPage = () => {
    return (
        <PageShell title="Acts" description="Акты (создание/редактирование/печать — позже).">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
                Тут будет список актов и кнопка “Создать акт”.
            </div>
        </PageShell>
    );
};

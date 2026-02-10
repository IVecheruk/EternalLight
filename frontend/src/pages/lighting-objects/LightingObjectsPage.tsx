import { PageShell } from "@/shared/ui/PageShell";

export const LightingObjectsPage = () => {
    return (
        <PageShell title="Lighting objects" description="Объекты освещения (позже подключим API).">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
                Тут будет список объектов + карточка объекта.
            </div>
        </PageShell>
    );
};

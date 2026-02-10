import { PageShell } from "@/shared/ui/PageShell";
import { Link } from "react-router-dom";

const items = [
    { title: "Organizations", text: "Организации-исполнители/заказчики.", to: "/organizations" },
    { title: "Districts", text: "Административные районы.", to: "/districts" },
    { title: "Streets", text: "Улицы (привязка к району).", to: "/streets" },
];

export const DictionariesPage = () => {
    return (
        <PageShell
            title="Dictionaries"
            description="Справочники системы. Начинаем с базовых."
        >
            <div className="grid gap-4 md:grid-cols-3">
                {items.map((x) => (
                    <Link
                        key={x.to}
                        to={x.to}
                        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:bg-neutral-50"
                    >
                        <div className="text-sm font-semibold text-neutral-900">{x.title}</div>
                        <div className="mt-2 text-sm text-neutral-600">{x.text}</div>
                    </Link>
                ))}
            </div>
        </PageShell>
    );
};

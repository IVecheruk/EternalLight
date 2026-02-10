import { Link } from "react-router-dom";

const items = [
    {
        title: "Organizations",
        description: "Организации (исполнитель/заказчик и т.п.)",
        to: "/organizations",
    },
    {
        title: "Districts",
        description: "Административные районы",
        to: "/districts",
    },
    {
        title: "Streets",
        description: "Улицы",
        to: "/streets",
    },
    {
        title: "Lighting objects",
        description: "Объекты освещения",
        to: "/lighting-objects",
    },
    {
        title: "Acts",
        description: "Акты и вложенные сущности (бригада, материалы, работы и т.д.)",
        to: "/acts",
    },
];

const apiReady = [
    "work-basis-types",
    "brigade-roles",
    "fault-types",
    "uoms",
    "employees",
    "equipment-conditions",
    "work-acts/{id}/basis",
    "work-acts/{id}/faults",
    "work-acts/{id}/brigade",
    "work-acts/{id}/approval",
    "work-acts/{id}/materials",
    "work-acts/{id}/labor-items",
    "work-acts/{id}/performed-works",
    "work-acts/{id}/equipment-usage",
    "work-acts/{id}/dismantled-equipment",
    "work-acts/{id}/installed-equipment",
];

export const DictionariesPage = () => {
    return (
        <div className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Dictionaries</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Раздел справочников и сущностей, подключенных к backend API.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                {items.map((it) => (
                    <Link
                        key={it.to}
                        to={it.to}
                        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                    >
                        <div className="text-sm font-semibold">{it.title}</div>
                        <div className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {it.description}
                        </div>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Open <span aria-hidden>→</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                <div className="mb-2 font-medium text-neutral-900 dark:text-neutral-100">Backend endpoints wired in frontend API layer:</div>
                <div className="flex flex-wrap gap-2">
                    {apiReady.map((entry) => (
                        <span key={entry} className="rounded-full border border-neutral-200 px-3 py-1 dark:border-neutral-700">
                            {entry}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

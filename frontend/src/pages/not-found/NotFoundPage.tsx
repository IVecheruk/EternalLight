import { Link } from "react-router-dom";
import { PageShell } from "@/shared/ui/PageShell";

export const NotFoundPage = () => {
    return (
        <PageShell title="404" description="Страница не найдена.">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
                <div className="mb-4">Такого маршрута нет.</div>
                <Link
                    to="/"
                    className="inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                >
                    Go Home
                </Link>
            </div>
        </PageShell>
    );
};

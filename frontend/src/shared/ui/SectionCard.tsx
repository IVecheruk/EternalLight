import { Link } from "react-router-dom";

type Props = {
    title: string;
    description?: string;
    to: string;
};

export function SectionCard({ title, description, to }: Props) {
    return (
        <Link
            to={to}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {title}
                    </div>
                    {description ? (
                        <div className="text-sm text-neutral-600 dark:text-neutral-300">{description}</div>
                    ) : null}
                </div>

                <div className="text-neutral-400 transition group-hover:translate-x-0.5 dark:text-neutral-500">
                    →
                </div>
            </div>
        </Link>
    );
}

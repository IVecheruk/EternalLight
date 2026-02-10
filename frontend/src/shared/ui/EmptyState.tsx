import type React from "react";

type Props = {
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <div className="space-y-2">
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</div>
                {description ? (
                    <div className="text-sm text-neutral-600 dark:text-neutral-300">{description}</div>
                ) : null}
            </div>

            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}

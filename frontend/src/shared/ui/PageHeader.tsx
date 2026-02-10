import type React from "react";

type Props = {
    title: string;
    description?: string;
    actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
    return (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {title}
                </h1>
                {description ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
                ) : null}
            </div>

            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
    );
}

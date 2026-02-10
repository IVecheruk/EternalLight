import React from "react";

type Props = {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    loading?: boolean;
    error?: string | null;
    children: React.ReactNode;
};

export const TablePage: React.FC<Props> = ({
                                               title,
                                               subtitle,
                                               actions,
                                               loading,
                                               error,
                                               children,
                                           }) => {
    return (
        <div className="space-y-6">
            <header className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
                    {subtitle ? <p className="text-sm text-neutral-600">{subtitle}</p> : null}
                </div>

                {actions ? <div className="shrink-0">{actions}</div> : null}
            </header>

            {loading ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
                    Loading…
                </div>
            ) : null}

            {!loading && error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                    {error}
                </div>
            ) : null}

            {!loading && !error ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-0 overflow-hidden">
                    {children}
                </div>
            ) : null}
        </div>
    );
};

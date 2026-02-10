import type { ReactNode } from "react";

type Props = {
    title: string;
    description?: string;
    right?: ReactNode;
    children: ReactNode;
};

export const PageShell = ({ title, description, right, children }: Props) => {
    return (
        <div className="space-y-6">
            <header className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
                    {description ? <p className="text-sm text-neutral-600">{description}</p> : null}
                </div>

                {right ? <div className="shrink-0">{right}</div> : null}
            </header>

            {children}
        </div>
    );
};

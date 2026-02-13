import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    open: boolean;
    title?: string;
    onClose: () => void;
}>;

export function Modal({ open, title, onClose, children }: Props) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={onClose}
        >
            <div className="absolute inset-0 bg-black/40" />
            <div
                className="relative w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {title && <div className="text-lg font-semibold">{title}</div>}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                        aria-label="Закрыть"
                        title="Закрыть"
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

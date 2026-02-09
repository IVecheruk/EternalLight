import { ReactNode, useEffect } from "react";

type Props = {
    open: boolean;
    title?: string;
    children: ReactNode;
    onClose: () => void;
};

export const Modal = ({ open, title, children, onClose }: Props) => {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onClose}
            />

            {/* panel */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <div className="text-sm font-semibold text-gray-900">{title ?? "Modal"}</div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="px-5 py-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

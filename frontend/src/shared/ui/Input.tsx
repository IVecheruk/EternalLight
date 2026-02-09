import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

export const Input = ({ label, className = "", ...props }: Props) => {
    return (
        <label className="block">
            {label && <div className="mb-1 text-xs text-gray-600">{label}</div>}
            <input
                className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 ${className}`}
                {...props}
            />
        </label>
    );
};

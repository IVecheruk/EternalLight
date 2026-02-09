import React from "react";

export const Card = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
            {...props}
        />
    );
};

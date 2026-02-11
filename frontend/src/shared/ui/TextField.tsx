type Props = {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    type?: string;
};

export function TextField({ label, value, placeholder, onChange, type = "text" }: Props) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:focus:border-neutral-600"
            />
        </div>
    );
}

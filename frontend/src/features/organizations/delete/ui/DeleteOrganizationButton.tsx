import { useState } from "react";
import { organizationApi } from "@/entities/organization/api/organizationApi";

interface Props {
    id: number;
    onDeleted: () => void;
}

export const DeleteOrganizationButton = ({ id, onDeleted }: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!confirm("Удалить эту организацию?")) return;

        setLoading(true);
        setError(null);

        try {
            await organizationApi.remove(id);
            onDeleted();
        } catch (e: any) {
            // FK constraint from backend
            if (e?.response?.status === 409 || e?.response?.status === 400) {
                setError(
                    "Невозможно удалить: организация используется в актах работ."
                );
            } else {
                setError("Ошибка при удалении.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                onClick={handleDelete}
                disabled={loading}
                className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
            >
                Удалить
            </button>

            {error && (
                <div className="max-w-[220px] text-right text-[11px] text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

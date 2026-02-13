import type { Organization } from "../model/types";
import { DeleteOrganizationButton } from "@/features/organizations/delete/ui/DeleteOrganizationButton";

interface Props {
    organization: Organization;
    onDeleted: () => void;
}

export const OrganizationRow = ({ organization, onDeleted }: Props) => {
    return (
        <li className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900">
                    {organization.fullName}
                </div>

                <div className="mt-1 text-xs text-gray-600">
                    ИД: {organization.id}
                    {organization.city && ` • ${organization.city}`}
                </div>
            </div>

            <DeleteOrganizationButton
                id={organization.id}
                onDeleted={onDeleted}
            />
        </li>
    );
};

import type { Organization } from "@/entities/organization/model/types";

type Props = {
    org: Organization;
};

export const OrganizationRow = ({ org }: Props) => {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div>
                <div className="text-sm font-semibold text-gray-900">{org.fullName}</div>
                <div className="text-xs text-gray-500">{org.city ?? "—"}</div>
            </div>

            <div className="text-xs text-gray-400">ИД: {org.id}</div>
        </div>
    );
};

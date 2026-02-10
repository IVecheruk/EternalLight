export type Organization = {
    id: number;
    fullName: string;
    city: string | null;
};

export type CreateOrganizationRequest = {
    fullName: string;
    city: string | null;
};

export type UpdateOrganizationRequest = {
    fullName: string;
    city: string | null;
};

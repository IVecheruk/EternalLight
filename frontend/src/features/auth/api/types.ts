export type LoginRequest = { email: string; password: string };
export type TokenResponse = {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    type?: string;
};

export type RegisterRequest = { email: string; password: string };
export type RegisterResponse = TokenResponse;

export type MeResponse = {
    id?: number;
    email: string;
    roles?: string[];
    role?: string;
    authorities?: string;
    fullName?: string | null;
    address?: string | null;
    birthDate?: string | null;
    phone?: string | null;
    notificationEmail?: string | null;
};

export type UpdateProfileRequest = {
    fullName?: string | null;
    address?: string | null;
    birthDate?: string | null;
    phone?: string | null;
    notificationEmail?: string | null;
};

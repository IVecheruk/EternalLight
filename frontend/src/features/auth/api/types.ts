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
    email: string;
    role?: string;
    authorities?: string;
};

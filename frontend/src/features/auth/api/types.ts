export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string };

/**
 * Backend currently returns { accessToken, refreshToken }.
 * Keep backward-compatible optional fields for older frontend stubs.
 */
export type TokenResponse = {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    type?: string;
};

export type MeResponse = {
    email: string;
    authorities?: string;
};

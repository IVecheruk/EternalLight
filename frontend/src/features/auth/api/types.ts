export type LoginRequest = { email: string; password: string };
export type TokenResponse = { token: string; type?: string };

export type MeResponse = {
    email: string;
    authorities?: string;
};

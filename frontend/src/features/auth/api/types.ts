export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string };

// Backend contract: { accessToken, refreshToken }
// Keep legacy fields optional to tolerate stale frontend builds/responses.
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

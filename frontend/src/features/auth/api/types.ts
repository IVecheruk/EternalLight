export type Role = "SUPER_ADMIN" | "ORG_ADMIN" | "DISPATCHER" | "TECHNICIAN";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string; role: Role };

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

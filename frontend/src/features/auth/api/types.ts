export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string };

export type TokenResponse = { token: string; type?: "Bearer" | string };

export type MeResponse = { email: string; authorities: string };

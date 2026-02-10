export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string };

export type TokenResponse = { token: string; type: "Bearer" | string };

// backend отдаёт: { name: string, authorities: string }
export type MeResponse = { name: string; authorities: string };

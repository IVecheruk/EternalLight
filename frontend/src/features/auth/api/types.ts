export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { email: string; password: string };

export type TokenResponse = { token: string; type?: "Bearer" | string };

export type MeResponse = {
    name: string;
    authorities: string;
    // если позже вернёшь email отдельным полем с backend — будет готово:
    email?: string;
};

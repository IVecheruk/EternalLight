export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
};

export const authApi = {
    // Скелет. Пока без реального backend auth.
    login: async (_body: LoginRequest): Promise<LoginResponse> => {
        await new Promise((r) => setTimeout(r, 250));
        return { accessToken: "DEV_TOKEN" };
    },
};

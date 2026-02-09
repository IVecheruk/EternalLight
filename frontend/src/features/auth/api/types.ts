export type TokenResponse = {
    token: string;
    type: string; // "Bearer"
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
};

export type MeResponse = {
    name: string;
    authorities: string;
};

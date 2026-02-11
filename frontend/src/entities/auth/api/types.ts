export type UserRole = "ADMIN" | "TECHNICIAN" | "USER";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
};

export type RegisterResponse = {
    id: number;
    email: string;
    role?: UserRole; // может не приходить
};

export type MeResponse = {
    id: number;
    email: string;
    role: UserRole;
};

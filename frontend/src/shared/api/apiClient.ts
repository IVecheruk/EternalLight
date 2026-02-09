import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Токен будем хранить в памяти (без localStorage на первом этапе — безопаснее)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

apiClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

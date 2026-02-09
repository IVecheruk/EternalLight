import axios from "axios";
import { tokenStorage } from "../auth/tokenStorage";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
    withCredentials: false,
});

http.interceptors.request.use((config) => {
    const token = tokenStorage.getAccess();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `${tokenStorage.getType()} ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            tokenStorage.clear();
            // можно редиректить на /login если хочешь:
            // window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

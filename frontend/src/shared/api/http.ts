import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Подставляем Bearer token для всех запросов
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

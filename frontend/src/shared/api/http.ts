import axios, { type AxiosRequestConfig } from "axios";

type HttpOptions = Omit<AxiosRequestConfig, "url" | "data" | "auth"> & {
    /** наш флаг, чтобы не конфликтовать с axios.auth */
    withAuth?: boolean;
    /** тело запроса (пойдёт в axios.data) */
    body?: unknown;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
    withCredentials: false, // JWT в заголовке, куки не нужны
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    // По умолчанию считаем, что запросы должны быть авторизованы,
    // но это можно выключить через withAuth: false
    const withAuth = (config as any).withAuth !== false;

    if (withAuth && token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // JSON по умолчанию
    config.headers = config.headers ?? {};
    if (!(config.headers as any)["Content-Type"]) {
        (config.headers as any)["Content-Type"] = "application/json";
    }

    return config;
});

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const { body, withAuth, ...rest } = options;

    const res = await api.request<T>({
        url,
        data: body,
        ...(rest as AxiosRequestConfig),
        // прокидываем наш флаг в конфиг (не axios.auth)
        ...(withAuth !== undefined ? ({ withAuth } as any) : {}),
    });

    return res.data;
}

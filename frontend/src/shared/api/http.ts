import axios, { type AxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers?.["Content-Type"] && config.method && config.method !== "get") {
        config.headers = config.headers ?? {};
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

export async function http<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.request<T>({ url, ...config });
    return res.data;
}

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const http = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// На будущее (авторизация): тут удобно добавлять токен в заголовки
// http.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

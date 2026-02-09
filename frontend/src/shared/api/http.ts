type HttpOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    auth?: boolean;
    headers?: Record<string, string>;
};

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const method = options.method ?? "GET";

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
    };

    if (options.auth) {
        const token = localStorage.getItem("accessToken");
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method,
        headers,
        body: options.body,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        // пробуем достать человеко-читаемое сообщение
        const msg =
            data?.message ||
            data?.error ||
            `Request failed with status code ${res.status}`;
        throw new Error(msg);
    }

    return data as T;
}

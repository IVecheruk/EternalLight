type HttpOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    auth?: boolean;
    headers?: Record<string, string>;
};

const TOKEN_KEY = "accessToken";

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const method = options.method ?? "GET";

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
    };

    if (options.auth) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method,
        headers,
        body: options.body,
    });

    if (res.status === 204) return null as T;

    const text = await res.text();
    let data: any = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const msg = data?.message || data?.error || `Request failed with status code ${res.status}`;
        throw new Error(msg);
    }

    return data as T;
}

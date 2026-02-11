type HttpOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean;
    headers?: Record<string, string>;
};

const TOKEN_KEY = "accessToken";

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const method = options.method ?? "GET";

    const headers: Record<string, string> = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers ?? {}),
    };

    if (options.auth) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok) {
        const msg =
            (data && (data.message || data.error)) ||
            `Request failed with status code ${res.status}`;
        throw new Error(msg);
    }

    return data as T;
}

function safeJson(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

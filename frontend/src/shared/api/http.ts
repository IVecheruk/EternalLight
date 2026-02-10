type HttpOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    auth?: boolean;
    headers?: Record<string, string>;
};

export class HttpError extends Error {
    status: number;
    data: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

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
        const msg =
            data?.message ||
            data?.error ||
            `Request failed with status code ${res.status}`;
        throw new HttpError(res.status, msg, data);
    }

    return data as T;
}

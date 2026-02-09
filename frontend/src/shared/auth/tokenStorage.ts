const ACCESS_KEY = "el_access_token";
const TYPE_KEY = "el_token_type"; // Bearer

export const tokenStorage = {
    getAccess(): string | null {
        return localStorage.getItem(ACCESS_KEY);
    },
    setAccess(token: string) {
        localStorage.setItem(ACCESS_KEY, token);
    },
    clear() {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(TYPE_KEY);
    },
    getType(): string {
        return localStorage.getItem(TYPE_KEY) || "Bearer";
    },
    setType(type: string) {
        localStorage.setItem(TYPE_KEY, type);
    },
};

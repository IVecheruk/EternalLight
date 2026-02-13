export function getErrorMessage(err: unknown): string {
    const anyErr = err as any;
    if (anyErr?.response?.data?.message) return String(anyErr.response.data.message);
    if (anyErr?.message) return String(anyErr.message);
    return "Неизвестная ошибка";
}

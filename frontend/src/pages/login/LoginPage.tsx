import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

export function LoginPage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ если уже залогинен — не показываем страницу
    if (isAuthenticated) return <Navigate to="/profile" replace />;

    const submit = async () => {
        try {
            setLoading(true);
            setError(null);
            await login({ email: email.trim(), password });
            navigate("/profile", { replace: true }); // ✅
        } catch (e) {
            setError(e instanceof Error ? e.message : "Не удалось войти.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Вход</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">Войдите в аккаунт.</p>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Эл. почта</label>
                    <input
                        type="email"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-950"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Пароль</label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-950"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    onClick={submit}
                    disabled={loading}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                >
                    {loading ? "Входим…" : "Войти"}
                </button>

                <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
                    Нет аккаунта?{" "}
                    <Link to="/register" className="font-medium underline">
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi"; // подстрой под свой импорт
import { useAuth } from "@/features/auth/model/useAuth";

export function RegisterPage() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (isAuthenticated) return <Navigate to="/profile" replace />;

    const submit = async () => {
        if (password !== password2) {
            setError("Пароли не совпадают.");
            return;
        }
        try {
            setLoading(true);
            setError(null);

            // 1) регистрируем
            await authApi.register({ email: email.trim(), password });

            // 2) логинимся и получаем токен
            await login({ email: email.trim(), password });

            // 3) в профиль
            navigate("/profile", { replace: true });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Регистрация</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    Создайте аккаунт. Роль назначит администратор.
                </p>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                    <input
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-950"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Password</label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-950"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Confirm password</label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-950"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    onClick={submit}
                    disabled={loading}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                >
                    {loading ? "Creating…" : "Create account"}
                </button>

                <div className="text-center text-sm text-neutral-600 dark:text-neutral-300">
                    Уже есть аккаунт?{" "}
                    <Link to="/login" className="font-medium underline">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}

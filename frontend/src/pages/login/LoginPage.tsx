import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        try {
            setLoading(true);
            setError(null);
            await login({ email: email.trim(), password });
            navigate("/profile", { replace: true });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-semibold">Login</h1>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                <input
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Password</label>
                <input
                    type="password"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Нет аккаунта?{" "}
                <Link to="/register" className="font-medium text-neutral-900 underline dark:text-neutral-100">
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
}

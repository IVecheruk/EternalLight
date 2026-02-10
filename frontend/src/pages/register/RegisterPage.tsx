import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import type { Role } from "@/features/auth/model/AuthContext";

const roleOptions: { value: Role; label: string }[] = [
    { value: "SUPER_ADMIN", label: "SUPER_ADMIN" },
    { value: "ORG_ADMIN", label: "ORG_ADMIN" },
    { value: "DISPATCHER", label: "DISPATCHER" },
    { value: "TECHNICIAN", label: "TECHNICIAN" },
];

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<Role>("TECHNICIAN");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return setError("Email обязателен");
        if (!password) return setError("Пароль обязателен");
        if (password.length < 6) return setError("Пароль должен быть не короче 6 символов");
        if (password !== confirmPassword) return setError("Пароли не совпадают");

        try {
            setLoading(true);
            setError(null);
            await register({ email: trimmedEmail, password, role });
            navigate("/profile", { replace: true });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-semibold">Регистрация</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Перед входом в систему зарегистрируй аккаунт.
            </p>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                    {error}
                </div>
            ) : null}

            <label className="block space-y-2">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Email</span>
                <input
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
            </label>

            <label className="block space-y-2">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Role</span>
                <select
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                >
                    {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block space-y-2">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Password</span>
                <input
                    type="password"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <label className="block space-y-2">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Confirm password</span>
                <input
                    type="password"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </label>

            <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
                {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="font-medium text-neutral-900 underline dark:text-neutral-100">
                    Войти
                </Link>
            </div>
        </div>
    );
}

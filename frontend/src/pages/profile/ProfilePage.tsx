import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

export const ProfilePage = () => {
    const { isAuthenticated, user, roles, logout } = useAuth();

    return (
        <div className="space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Личный кабинет с данными пользователя и ролью доступа в системе.
                </p>
            </header>

            {!isAuthenticated ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-sm font-semibold">Ты не авторизован</div>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Перейди на страницу входа, чтобы продолжить.</p>
                    <div className="mt-4">
                        <Link to="/login" className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">Go to Login</Link>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-sm font-semibold">Ты авторизован</div>
                    <div className="mt-3 space-y-2 text-sm">
                        <Row label="Email" value={user?.email ?? "—"} />
                        <Row label="Authorities" value={user?.authorities ?? "—"} />
                        <Row label="Parsed roles" value={roles.join(", ") || "—"} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <Link
                            to="/organizations"
                            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                        >
                            Open Organizations
                        </Link>
                        <button type="button" onClick={logout} className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

function Row(props: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="text-neutral-600 dark:text-neutral-400">{props.label}</div>
            <div className="truncate font-medium">{props.value}</div>
        </div>
    );
}

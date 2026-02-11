import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

export function ProfilePage() {
    const { isReady, isAuthenticated, user } = useAuth();

    if (!isReady) return <div className="text-sm text-neutral-600">Loading…</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                    Личный кабинет пользователя.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-xs font-semibold text-neutral-500">Email</div>
                    <div className="mt-1 text-sm">{user?.email ?? "—"}</div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="text-xs font-semibold text-neutral-500">Role</div>
                    <div className="mt-1 text-sm">
                        {/* подставь поле роли из MeResponse, когда появится */}
                        {(user as any)?.role ?? "Not assigned (admin will set)"}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { PageShell } from "@/shared/ui/PageShell";
import { useAuth } from "@/features/auth/model/useAuth";

export const ProfilePage = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <PageShell title="Profile" description="Личный кабинет. Позже добавим роли и настройки.">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-800">
                <div className="space-y-2">
                    <div>
                        <span className="font-medium">Authenticated:</span>{" "}
                        {isAuthenticated ? "yes" : "no"}
                    </div>

                    <div>
                        <span className="font-medium">User:</span>{" "}
                        {user ? JSON.stringify(user) : "null"}
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

import { Card } from "@/shared/ui/Card";
import { useAuth } from "@/features/auth/model/useAuth";

export const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

            <Card className="mt-6 p-5">
                <div className="text-sm text-gray-600">Signed in as</div>
                <div className="mt-1 text-lg font-semibold">
                    {user?.name ?? "-"}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                    Later: roles, permissions, personal cabinet, settings.
                </div>
            </Card>
        </div>
    );
};

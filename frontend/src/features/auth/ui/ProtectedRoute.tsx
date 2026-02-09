import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../model/AuthContext";

export const ProtectedRoute = () => {
    const { isLoading, isAuthed } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-600">
                Loading…
            </div>
        );
    }

    if (!isAuthed) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

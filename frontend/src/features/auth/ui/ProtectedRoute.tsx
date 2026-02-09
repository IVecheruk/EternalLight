import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

export const ProtectedRoute = () => {
    const { isReady, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isReady) return <div className="text-sm text-gray-600">Loading...</div>;

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return <Outlet />;
};

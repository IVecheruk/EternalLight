import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../model/useAuth";

export const ProtectedRoute = () => {
    const { isReady, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isReady) return null; // можешь поставить лоадер
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

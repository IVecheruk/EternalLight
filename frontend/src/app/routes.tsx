import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import OrganizationsPage from "@/pages/organizations/OrganizationsPage";
import { ProtectedRoute } from "@/features/auth/ui/ProtectedRoute";
import { ProfilePage } from "@/pages/profile/ProfilePage";

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/organizations", element: <OrganizationsPage /> },

            // protected zone
            {
                element: <ProtectedRoute />,
                children: [{ path: "/profile", element: <ProfilePage /> }],
            },
        ],
    },
]);

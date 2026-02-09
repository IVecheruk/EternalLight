import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { ProtectedRoute } from "@/features/auth/ui/ProtectedRoute";
import { OrganizationsPage } from "@/pages/organizations/OrganizationsPage";
import { HomePage } from "@/pages/home/HomePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "profile", element: <ProfilePage /> },
                    { path: "organizations", element: <OrganizationsPage /> },
                ],
            },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { OrganizationsPage } from "@/pages/organizations/OrganizationsPage";
import { DictionariesPage } from "@/pages/dictionaries/DictionariesPage";
import { DistrictsPage } from "@/pages/districts/DistrictsPage";
import { StreetsPage } from "@/pages/streets/StreetsPage";
import { LightingObjectsPage } from "@/pages/lighting-objects/LightingObjectsPage";
import { ActsPage } from "@/pages/acts/ActsPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { RequireAuth } from "@/features/auth/ui/RequireAuth";
import { RoleGuard } from "@/features/permissions/ui/RoleGuard";
import { AdminOrganizationsPage } from "@/pages/admin/organizations/AdminOrganizationsPage";
import { AdminUsersPage } from "@/pages/admin/users/AdminUsersPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: (
                    <RequireAuth>
                        <HomePage />
                    </RequireAuth>
                ),
            },
            { path: "register", element: <RegisterPage /> },
            { path: "login", element: <LoginPage /> },
            {
                path: "profile",
                element: (
                    <RequireAuth>
                        <ProfilePage />
                    </RequireAuth>
                ),
            },
            {
                path: "organizations",
                element: (
                    <RequireAuth>
                        <OrganizationsPage />
                    </RequireAuth>
                ),
            },
            {
                path: "districts",
                element: (
                    <RequireAuth>
                        <DistrictsPage />
                    </RequireAuth>
                ),
            },
            {
                path: "streets",
                element: (
                    <RequireAuth>
                        <StreetsPage />
                    </RequireAuth>
                ),
            },
            {
                path: "dictionaries",
                element: (
                    <RequireAuth>
                        <DictionariesPage />
                    </RequireAuth>
                ),
            },
            {
                path: "lighting-objects",
                element: (
                    <RequireAuth>
                        <LightingObjectsPage />
                    </RequireAuth>
                ),
            },
            {
                path: "acts",
                element: (
                    <RequireAuth>
                        <ActsPage />
                    </RequireAuth>
                ),
            },
            {
                path: "admin/organizations",
                element: (
                    <RoleGuard roles={["SUPER_ADMIN", "ORG_ADMIN"]}>
                        <AdminOrganizationsPage />
                    </RoleGuard>
                ),
            },
            {
                path: "admin/users",
                element: (
                    <RoleGuard roles={["SUPER_ADMIN", "ORG_ADMIN"]}>
                        <AdminUsersPage />
                    </RoleGuard>
                ),
            },
            { path: "home", element: <Navigate to="/" replace /> },
            { path: "map", element: <Navigate to="/" replace /> },
            { path: "maps", element: <Navigate to="/" replace /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
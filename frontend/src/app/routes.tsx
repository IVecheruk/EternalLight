import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";
import { PublicLayout } from "@/app/layout/PublicLayout";
import { ProtectedRoute } from "@/features/auth/ui/ProtectedRoute";
import { RoleGuard } from "@/features/permissions/ui/RoleGuard";
import { ADMIN_ROLES, SUPER_ADMIN_ROLES, TECHNICIAN_ROLES } from "@/features/permissions/model/roles";

import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { AllDataPage } from "@/pages/all-data/AllDataPage";

import { OrganizationsPage } from "@/pages/organizations/OrganizationsPage";
import { DictionariesPage } from "@/pages/dictionaries/DictionariesPage";
import { DistrictsPage } from "@/pages/districts/DistrictsPage";
import { StreetsPage } from "@/pages/streets/StreetsPage";

import { LightingObjectsPage } from "@/pages/lighting-objects/LightingObjectsPage";
import { ActsPage } from "@/pages/acts/ActsPage";

import { MapPage } from "@/pages/map/MapPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { UsersPage } from "@/pages/users/UsersPage";

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
        ],
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    // home
                    {
                        index: true,
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <HomePage />
                            </RoleGuard>
                        ),
                    },
                    {
                        path: "all-data",
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <AllDataPage />
                            </RoleGuard>
                        ),
                    },
                    { path: "profile", element: <ProfilePage /> },

                    // navigation pages
                    {
                        path: "organizations",
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <OrganizationsPage />
                            </RoleGuard>
                        ),
                    },
                    {
                        path: "districts",
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <DistrictsPage />
                            </RoleGuard>
                        ),
                    },
                    {
                        path: "streets",
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <StreetsPage />
                            </RoleGuard>
                        ),
                    },
                    {
                        path: "dictionaries",
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <DictionariesPage />
                            </RoleGuard>
                        ),
                    },

                    // main entities
                    {
                        path: "lighting-objects",
                        element: (
                            <RoleGuard roles={ADMIN_ROLES} fallbackPath="/map" allowUserPreview>
                                <LightingObjectsPage />
                            </RoleGuard>
                        ),
                    },
                    {
                        path: "acts",
                        element: (
                            <RoleGuard roles={TECHNICIAN_ROLES} fallbackPath="/profile" allowUserPreview>
                                <ActsPage />
                            </RoleGuard>
                        ),
                    },

                    // map
                    {
                        path: "map",
                        element: (
                            <RoleGuard roles={TECHNICIAN_ROLES} fallbackPath="/profile" allowUserPreview>
                                <MapPage />
                            </RoleGuard>
                        ),
                    },

                    // users management
                    {
                        path: "users",
                        element: (
                            <RoleGuard roles={SUPER_ADMIN_ROLES} fallbackPath="/" allowUserPreview>
                                <UsersPage />
                            </RoleGuard>
                        ),
                    },

                    // redirects (не обязательно, но удобно)
                    { path: "home", element: <Navigate to="/" replace /> },
                    { path: "maps", element: <Navigate to="/map" replace /> },

                    // 404
                    { path: "*", element: <NotFoundPage /> },
                ],
            },
        ],
    },
]);

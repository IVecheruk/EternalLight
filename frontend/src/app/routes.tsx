import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/app/layout/AppLayout";

import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";

import { OrganizationsPage } from "@/pages/organizations/OrganizationsPage";
import { DictionariesPage } from "@/pages/dictionaries/DictionariesPage";
import { DistrictsPage } from "@/pages/districts/DistrictsPage";
import { StreetsPage } from "@/pages/streets/StreetsPage";

import { LightingObjectsPage } from "@/pages/lighting-objects/LightingObjectsPage";
import { ActsPage } from "@/pages/acts/ActsPage";

import { MapPage } from "@/pages/map/MapPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { RequireAuth } from "@/features/auth/ui/RequireAuth";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
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
                path: "map",
                element: (
                    <RequireAuth>
                        <MapPage />
                    </RequireAuth>
                ),
            },
            { path: "home", element: <Navigate to="/" replace /> },
            { path: "maps", element: <Navigate to="/map" replace /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },

            // auth (пока без защиты)
            { path: "login", element: <LoginPage /> },
            { path: "profile", element: <ProfilePage /> },

            // navigation pages
            { path: "dictionaries", element: <DictionariesPage /> },
            { path: "organizations", element: <OrganizationsPage /> },
            { path: "districts", element: <DistrictsPage /> },
            { path: "streets", element: <StreetsPage /> },

            // main entities
            { path: "lighting-objects", element: <LightingObjectsPage /> },
            { path: "acts", element: <ActsPage /> },

            // map
            { path: "map", element: <MapPage /> },

            // 404 (always last)
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

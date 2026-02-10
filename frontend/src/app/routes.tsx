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

import { NotFoundPage } from "@/pages/not-found/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },

            { path: "login", element: <LoginPage /> },
            { path: "profile", element: <ProfilePage /> },

            { path: "dictionaries", element: <DictionariesPage /> },
            { path: "organizations", element: <OrganizationsPage /> },
            { path: "districts", element: <DistrictsPage /> },
            { path: "streets", element: <StreetsPage /> },

            { path: "lighting-objects", element: <LightingObjectsPage /> },
            { path: "acts", element: <ActsPage /> },

            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

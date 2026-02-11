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

import { MapPage } from "@/pages/map/MapPage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            // home
            { index: true, element: <HomePage /> },

            // auth (пока без защиты)
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "profile", element: <ProfilePage /> },

            // navigation pages
            { path: "organizations", element: <OrganizationsPage /> },
            { path: "districts", element: <DistrictsPage /> },
            { path: "streets", element: <StreetsPage /> },
            { path: "dictionaries", element: <DictionariesPage /> },

            // main entities
            { path: "lighting-objects", element: <LightingObjectsPage /> },
            { path: "acts", element: <ActsPage /> },

            // map
            { path: "map", element: <MapPage /> },

            // redirects (не обязательно, но удобно)
            { path: "home", element: <Navigate to="/" replace /> },
            { path: "maps", element: <Navigate to="/map" replace /> },

            // 404
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

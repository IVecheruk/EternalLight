import { AuthProvider } from "@/features/auth/model/AuthProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export const App = () => (
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);

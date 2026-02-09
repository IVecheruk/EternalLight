import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../features/auth/model/AuthContext";
import { RequireAuth } from "../features/auth/ui/RequireAuth";
import LoginPage from "../pages/LoginPage";

function Home() {
    return <div>Home (public)</div>;
}

function Dashboard() {
    return <div>Dashboard (protected)</div>;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

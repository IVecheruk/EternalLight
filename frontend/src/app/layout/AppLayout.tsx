import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import { Button } from "@/shared/ui/Button";

export const AppLayout = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link to="/" className="text-sm font-semibold tracking-tight">
                        EternalLight
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link className="text-sm text-gray-700 hover:text-black" to="/organizations">
                            Organizations
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link className="text-sm text-gray-700 hover:text-black" to="/profile">
                                    {user?.name ?? "Profile"}
                                </Link>
                                <Button variant="secondary" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link className="text-sm text-gray-700 hover:text-black" to="/login">
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

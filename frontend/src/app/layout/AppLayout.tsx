import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/model/AuthContext";
import { Button } from "@/shared/ui/Button";

export const AppLayout = () => {
    const { isAuthed, user, logout } = useAuth();

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="text-sm font-semibold tracking-tight">
                        EternalLight
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link className="text-sm text-gray-700 hover:text-black" to="/organizations">
                            Organizations
                        </Link>

                        {isAuthed ? (
                            <>
                                <Link className="text-sm text-gray-700 hover:text-black" to="/profile">
                                    {user?.email ?? "Profile"}
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

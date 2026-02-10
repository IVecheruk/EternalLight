import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import { Button } from "@/shared/ui/Button";
import { useTheme } from "@/app/theme/ThemeProvider";

const navItems = [
    { to: "/organizations", label: "Organizations" },
    { to: "/districts", label: "Districts" },
    { to: "/streets", label: "Streets" },
    { to: "/lighting-objects", label: "Lighting objects" },
    { to: "/acts", label: "Acts" },
    { to: "/dictionaries", label: "Dictionaries" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
        "block rounded-xl px-3 py-2 text-sm transition",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400",
        "dark:focus:ring-neutral-600 dark:focus:ring-offset-neutral-950",
        isActive
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
    ].join(" ");

export const AppLayout = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link
                        to="/"
                        className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
                    >
                        EternalLight
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Theme toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50
                         dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            title="Toggle theme"
                        >
                            {isDark ? "Light" : "Dark"}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    className="text-sm text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
                                    to="/profile"
                                >
                                    {user?.email ?? "Profile"}
                                </Link>

                                {/* если твой Button не имеет dark-стилей — это ок, потом добавим */}
                                <Button variant="secondary" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link
                                className="text-sm text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
                                to="/login"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Page */}
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="px-2 pb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        NAVIGATION
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((i) => (
                            <NavLink key={i.to} to={i.to} className={navLinkClass}>
                                {i.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import { Button } from "@/shared/ui/Button";
import { useTheme } from "@/app/theme/ThemeProvider";

type NavItem = {
    to: string;
    label: string;
    auth?: boolean;
    roles?: string[];
};

const navItems: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/organizations", label: "Organizations", auth: true },
    { to: "/districts", label: "Districts", auth: true },
    { to: "/streets", label: "Streets", auth: true },
    { to: "/lighting-objects", label: "Lighting objects", auth: true },
    { to: "/acts", label: "Acts", auth: true },
    { to: "/dictionaries", label: "Dictionaries", auth: true },
    { to: "/map", label: "Map", auth: true },
    { to: "/admin/organizations", label: "Admin • Organizations", auth: true, roles: ["SUPER_ADMIN", "ADMIN"] },
    { to: "/admin/users", label: "Admin • Users", auth: true, roles: ["SUPER_ADMIN", "ADMIN"] },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
        "block rounded-xl px-3 py-2 text-sm transition",
        "focus:outline-none focus:ring-2 focus:ring-neutral-400/40 dark:focus:ring-neutral-500/40",
        isActive
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900",
    ].join(" ");

export const AppLayout = () => {
    const { isAuthenticated, user, logout, hasRole } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const visibleNavItems = navItems.filter((item) => {
        if (item.auth && !isAuthenticated) return false;
        if (item.roles?.length) return hasRole(...item.roles);
        return true;
    });

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link to="/" className="text-sm font-semibold tracking-tight">
                        EternalLight
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                            aria-label="Toggle theme"
                            title="Toggle theme"
                        >
                            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    className="text-sm text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
                                    to="/profile"
                                >
                                    {user?.email ?? "Profile"}
                                </Link>

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

            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
                <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="px-2 pb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">NAVIGATION</div>

                    <nav className="space-y-1">
                        {visibleNavItems.map((i) => (
                            <NavLink key={i.to} to={i.to} className={navLinkClass} end={i.to === "/"}>
                                {i.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

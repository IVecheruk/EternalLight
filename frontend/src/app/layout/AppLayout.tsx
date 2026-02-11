import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import { useTheme } from "@/app/theme/ThemeProvider";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/organizations", label: "Organizations" },
    { to: "/districts", label: "Districts" },
    { to: "/streets", label: "Streets" },
    { to: "/lighting-objects", label: "Lighting objects" },
    { to: "/acts", label: "Acts" },
    { to: "/dictionaries", label: "Dictionaries" },
    { to: "/map", label: "Map" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
        "block rounded-xl px-3 py-2 text-sm transition",
        "focus:outline-none focus:ring-2 focus:ring-neutral-400/40 dark:focus:ring-neutral-500/40",
        isActive
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900",
    ].join(" ");

function initials(email?: string) {
    if (!email) return "U";
    return email.trim().slice(0, 1).toUpperCase();
}

export const AppLayout = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link to="/" className="text-sm font-semibold tracking-tight">
                        EternalLight
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Theme toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                            aria-label="Toggle theme"
                            title="Toggle theme"
                        >
                            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                        </button>

                        {/* Auth area */}
                        {isAuthenticated ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 py-1.5 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                                    aria-label="Open profile menu"
                                >
                                    <div className="grid h-8 w-8 place-items-center rounded-full bg-neutral-900 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                                        {initials(user?.email)}
                                    </div>

                                    <span className="hidden text-sm text-neutral-700 dark:text-neutral-200 md:block">
                    {user?.email ?? "Account"}
                  </span>
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                                        <Link
                                            to="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                        >
                                            Profile
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    className="text-sm text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
                                    to="/register"
                                >
                                    Register
                                </Link>
                                <Link
                                    className="text-sm text-neutral-700 hover:text-black dark:text-neutral-200 dark:hover:text-white"
                                    to="/login"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Page */}
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="px-2 pb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        NAVIGATION
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((i) => (
                            <NavLink key={i.to} to={i.to} className={navLinkClass} end={i.to === "/"}>
                                {i.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

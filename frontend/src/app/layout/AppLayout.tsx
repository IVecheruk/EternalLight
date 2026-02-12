import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";
import { useTheme } from "@/app/theme/ThemeProvider";
import { usePermissions } from "@/features/permissions/model/usePermissions";
import { ADMIN_ROLES, SUPER_ADMIN_ROLES, TECHNICIAN_ROLES } from "@/features/permissions/model/roles";

type NavItem = {
    to: string;
    label: string;
    roles?: readonly string[];
};

type NavSection = {
    title: string;
    items: NavItem[];
};

const navSections: NavSection[] = [
    {
        title: "Overview",
        items: [
            { to: "/", label: "Home", roles: ADMIN_ROLES },
            { to: "/all-data", label: "All data", roles: ADMIN_ROLES },
        ],
    },
    {
        title: "Infrastructure",
        items: [
            { to: "/organizations", label: "Organizations", roles: ADMIN_ROLES },
            { to: "/districts", label: "Districts", roles: ADMIN_ROLES },
            { to: "/streets", label: "Streets", roles: ADMIN_ROLES },
            { to: "/lighting-objects", label: "Lighting objects", roles: ADMIN_ROLES },
        ],
    },
    {
        title: "Operations",
        items: [
            { to: "/acts", label: "Acts", roles: TECHNICIAN_ROLES },
            { to: "/map", label: "Map", roles: TECHNICIAN_ROLES },
        ],
    },
    {
        title: "Reference",
        items: [{ to: "/dictionaries", label: "Dictionaries", roles: ADMIN_ROLES }],
    },
    {
        title: "System",
        items: [{ to: "/users", label: "Users", roles: SUPER_ADMIN_ROLES }],
    },
];

const navLinkClass = ({ isActive, isLocked }: { isActive: boolean; isLocked?: boolean }) =>
    [
        "block rounded-xl px-3 py-2 text-sm transition",
        "focus:outline-none focus:ring-2 focus:ring-neutral-400/40 dark:focus:ring-neutral-500/40",
        isLocked ? "opacity-60" : "",
        isActive
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900",
    ].join(" ");

function initials(email?: string) {
    if (!email) return "U";
    return email.trim().slice(0, 1).toUpperCase();
}

export const AppLayout = () => {
    const { isAuthenticated, user, logout, hasRole } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { isViewerOnly } = usePermissions();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(true);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const filteredSections = navSections
        .map((section) => {
            const items = isViewerOnly
                ? section.items
                : section.items.filter((item) => !item.roles || hasRole(...item.roles));
            return { ...section, items };
        })
        .filter((section) => section.items.length > 0);

    const shouldBlur = isViewerOnly && !location.pathname.startsWith("/profile");

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
                    {isAuthenticated ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setNavOpen((v) => !v)}
                                aria-expanded={navOpen}
                                aria-controls="app-navigation"
                                className="flex w-full items-center justify-between rounded-xl px-2 pb-2 text-left text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                            >
                                <span>NAVIGATION</span>
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    aria-hidden="true"
                                    className={[
                                        "h-4 w-4 transition-transform duration-200",
                                        navOpen ? "rotate-180" : "rotate-0",
                                    ].join(" ")}
                                >
                                    <path
                                        d="M5 8l5 5 5-5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            <nav
                                id="app-navigation"
                                className={[
                                    "space-y-3 overflow-hidden transition-all duration-200",
                                    navOpen ? "max-h-[680px] opacity-100" : "pointer-events-none max-h-0 opacity-0",
                                ].join(" ")}
                            >
                                {filteredSections.map((section) => (
                                    <div key={section.title} className="space-y-1">
                                        <div className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                                            {section.title}
                                        </div>
                                        {section.items.map((i) => {
                                            const isLocked = !!i.roles?.length && isViewerOnly && !hasRole(...i.roles);
                                            return (
                                                <NavLink
                                                    key={i.to}
                                                    to={i.to}
                                                    className={({ isActive }) => navLinkClass({ isActive, isLocked })}
                                                    end={i.to === "/"}
                                                >
                                                    {i.label}
                                                </NavLink>
                                            );
                                        })}
                                    </div>
                                ))}
                            </nav>
                        </>
                    ) : (
                        <div className="space-y-1 px-2 pb-2">
                            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                NAVIGATION
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Sign in to access navigation.
                            </div>
                        </div>
                    )}
                </aside>

                {/* Content */}
                <main className="relative min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                    {shouldBlur ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 p-6 text-center backdrop-blur-sm dark:bg-neutral-950/60">
                            <div className="max-w-md rounded-2xl border border-neutral-200 bg-white/90 p-5 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-950/90">
                                <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                    Preview mode
                                </div>
                                <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                                    Only the profile is available for this role. Ask an administrator to assign a role.
                                </p>
                                <Link
                                    to="/profile"
                                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-black dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                                >
                                    Go to profile
                                </Link>
                            </div>
                        </div>
                    ) : null}
                    <div className={shouldBlur ? "pointer-events-none blur-sm" : ""}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

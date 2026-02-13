import { NavLink } from "react-router-dom";

const linkBase =
    "px-3 py-2 text-sm font-medium transition-colors";
const linkInactive =
    "text-gray-600 hover:text-gray-900";
const linkActive =
    "text-gray-900";

export const Header = () => {
    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                {/* Logo */}
                <div className="text-lg font-semibold tracking-tight">
                    EternalLight
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Главная
                    </NavLink>

                    <NavLink
                        to="/organizations"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Организации
                    </NavLink>

                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                        }
                    >
                        Войти
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

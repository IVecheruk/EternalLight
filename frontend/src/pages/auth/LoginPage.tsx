import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

type LocationState = {
    from?: string;
};

export const LoginPage = () => {
    const nav = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [email, setEmail] = useState("admin@eternallight.local");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const from = (location.state as LocationState | null)?.from ?? "/profile";

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login({ email: email.trim(), password });
            nav(from, { replace: true });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "60px auto" }}>
            <h1>Sign in</h1>

            <div style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%" }}
                    autoComplete="email"
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%" }}
                    autoComplete="current-password"
                />
            </div>

            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
};

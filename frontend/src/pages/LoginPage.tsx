import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

type LocationState = {
    from?: string;
};

export const LoginPage = () => {
    const { login } = useAuth();
    const nav = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("admin@eternallight.local");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const state = location.state as LocationState | null;
    const from = state?.from ?? "/";

    async function onSubmit(e: { preventDefault(): void }) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login({ email, password });
            nav(from, { replace: true });
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Login failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto" }}>
            <h1>Sign in</h1>

            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Password</label>
                    <input
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

                <button disabled={loading} style={{ width: "100%" }}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/model/useAuth";

export const LoginPage = () => {
    const nav = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("admin@eternallight.local");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login({ email, password });
            nav("/profile", { replace: true });
        } catch (e: any) {
            setError(e?.message ?? "Login failed");
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Sign in</button>
        </form>
    );
};

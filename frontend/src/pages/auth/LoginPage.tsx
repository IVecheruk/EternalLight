import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useAuth } from "@/features/auth/model/AuthContext";


export const LoginPage = () => {
    const nav = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("admin@eternallight.local");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            nav("/profile");
        } catch (e: any) {
            setError(e?.response?.data?.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600">
                Minimal auth skeleton. Later we’ll connect it to real backend security.
            </p>

            <Card className="mt-6 p-5">
                <form onSubmit={submit} className="space-y-3">
                    <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <Button className="w-full" disabled={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

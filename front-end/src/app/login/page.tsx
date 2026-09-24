'use client';

import { useState } from "react";
import { setToken } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authControllerLogin } from "@/lib/generated";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        try {
            const { data } = await authControllerLogin({ email, password });
            setToken(data.accessToken);
            router.push('/profiel');
        } catch (err) {
            if (err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.')
            }
        }
    }

    return (
        <div className="max-w-md">
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Inloggen</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">E-mailadres</label>
                    <input
                        className="w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">Wachtwoord</label>
                    <input
                        className="w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {err && (
                    <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                        {err}
                    </p>
                )}
                <Button type="submit">Inloggen</Button>
            </form>
        </div>
    )
}
'use client';

import { useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { setToken } from "@/lib/cookies";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        try {
            const data = await apiFetch<{ accessToken: string}>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({email, password}),
            });
            setToken(data.accessToken);
            router.push('/profiel');
        } catch (err) {
            if(err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.')
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">E-mailadres</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Wachtwoord</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {err && <p role="alert">{err}</p>}
            <button type="submit">Inloggen</button>
        </form>
    )
}
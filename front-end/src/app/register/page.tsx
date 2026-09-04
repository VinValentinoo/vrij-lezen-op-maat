'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

type Role = 'STUDENT' | 'DOCENT';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>('STUDENT');
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        try {
            await apiFetch<{ message: string, email: string, name: string, role: string }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name, role }),
            });
            router.push('/login');
        } catch (err) {
            if (err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.')
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Naam</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="role">Rol</label>
                <select name="role" id="role" onChange={(e) => setRole(e.target.value)}>
                    <option value="STUDENT">Student</option>
                    <option value="DOCENT">Docent</option>
                </select>
            </div>
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
            <button type="submit">Registeren</button>
        </form>
    )
}
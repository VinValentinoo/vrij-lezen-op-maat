'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

type Role = 'STUDENT' | 'DOCENT';

const inputClass =
    "w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const labelClass = "mb-1 block text-sm font-medium text-ink";

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
        <div className="max-w-md">
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Registreren</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className={labelClass}>Naam</label>
                    <input
                        className={inputClass}
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className={labelClass}>Rol</label>
                    <select
                        name="role"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className={inputClass}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="DOCENT">Docent</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className={labelClass}>E-mailadres</label>
                    <input
                        className={inputClass}
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className={labelClass}>Wachtwoord</label>
                    <input
                        className={inputClass}
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
                <Button type="submit">Registreren</Button>
            </form>
        </div>
    )
}
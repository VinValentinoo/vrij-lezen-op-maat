'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";

type Docent = {
    id: string;
    naam: string;
    email: string;
};

const inputClass =
    "w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const labelClass = "mb-1 block text-sm font-medium text-ink";

export default function KoppelenPage() {
    const [docenten, setDocenten] = useState<Docent[]>([]);
    const [gekozenDocentId, setGekozenDocentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [succes, setSucces] = useState(false);

    useEffect(() => {
        async function loadDocenten() {
            setLoading(true);
            setErr('');

            try {
                const data = await apiFetch<Docent[]>('/koppeling');
                setDocenten(data);
            } catch (err) {
                if (err instanceof Error) {
                    setErr(err.message);
                } else {
                    setErr('Er is iets mis gegaan.');
                }
            } finally {
                setLoading(false);
            }
        }

        loadDocenten();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr('');
        setSucces(false);

        try {
            await apiFetch('/koppeling', {
                method: 'POST',
                body: JSON.stringify({ docentId: gekozenDocentId }),
            });
            setSucces(true);
        } catch (err) {
            if (err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.');
            }
        }
    }

    if (loading) {
        return <Skeleton lines={3} />;
    }

    return (
        <div className="max-w-md">
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Koppel aan een docent</h1>

            {succes && (
                <p role="status" className="mb-4 rounded-md bg-success-soft px-3 py-2 text-sm text-success">
                    Je bent nu gekoppeld aan je docent.
                </p>
            )}
            {err && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {err}
                </p>
            )}

            {docenten.length === 0 ? (
                <p className="text-sm text-muted">Er zijn nog geen docenten beschikbaar om aan te koppelen.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="docent" className={labelClass}>Kies je docent</label>
                        <select
                            id="docent"
                            className={inputClass}
                            value={gekozenDocentId}
                            onChange={(e) => setGekozenDocentId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Maak een keuze</option>
                            {docenten.map((docent) => (
                                <option key={docent.id} value={docent.id}>
                                    {docent.naam} ({docent.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit">Koppelen</Button>
                </form>
            )}
        </div>
    );
}
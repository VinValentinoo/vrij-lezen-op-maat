'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";

type Docent = {
    id: string;
    naam: string;
    email: string;
};

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
        return <h1 className="text-xl font-semibold">Laden...</h1>;
    }

    return (
        <div>
            <h1 className="text-xl font-semibold">Koppel aan een docent</h1>

            {succes && <p role="status">Je bent nu gekoppeld aan je docent.</p>}
            {err && <p role="alert">{err}</p>}

            {docenten.length === 0 ? (
                <p>Er zijn nog geen docenten beschikbaar om aan te koppelen.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="docent">Kies je docent</label>
                        <select
                            id="docent"
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
                    <button type="submit">Koppelen</button>
                </form>
            )}
        </div>
    );
}
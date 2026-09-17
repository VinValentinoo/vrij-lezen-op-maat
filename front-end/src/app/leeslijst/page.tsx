'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";

type Leeslijst = {
    id: string;
    titel: string;
    beschrijving: string;
    status: 'NIET_GELEZEN' | 'GELEZEN';
}

export default function LeeslijstPage() {
    const [leeslijst, setLeeslijst] = useState<Leeslijst[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        async function loadLeeslijst() {
            setLoading(true);
            setErr('');

            try {
                const data = await apiFetch<Leeslijst[]>('/leeslijst')
                setLeeslijst(data);
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

        loadLeeslijst();
    }, []);

    async function handleToggle(id: string) {
        setErr('');

        try {
            const bijgewerktItem = await apiFetch<Leeslijst>(`/leeslijst/${id}/toggle`, {
                method: 'PATCH'
            });

            setLeeslijst((huidigeLijst) =>
                huidigeLijst.map((item) =>
                    item.id === bijgewerktItem.id
                        ? { ...item, status: bijgewerktItem.status }
                        : item
                )
            );
        } catch (err) {
            if (err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.');
            }
        }
    }

    if (loading) {
        return <h1 className="text-xl font-semibold">Loading...</h1>
    } else {
        return (
            <div>
                <h1 className="text-xl font-semibold">Leeslijst</h1>
                {err && <p role="alert">{err}</p>}
                {leeslijst.length === 0 ? <p>Leeslijst is nog leeg</p> :
                    <ul>
                        {leeslijst.map((item) => (
                            <li key={item.id}>
                                <h2>{item.titel}</h2>
                                <p>{item.beschrijving}</p>
                                <button onClick={() => handleToggle(item.id)} className="w-auto h-auto px-5 bg-blue-600 rounded hover:bg-blue-500">
                                    {item.status === 'GELEZEN' ? 'Markeer als niet gelezen' : 'Markeer als gelezen'}
                                </button>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        )
    }
}

'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";

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
        return <Skeleton lines={4} />;
    }

    return (
        <div>
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Leeslijst</h1>

            {err && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {err}
                </p>
            )}

            {leeslijst.length === 0 ? (
                <p className="text-sm text-muted">Je leeslijst is nog leeg.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {leeslijst.map((item) => (
                        <div key={item.id} className="flex flex-col rounded-lg border border-brand-soft bg-white p-4 shadow-sm">
                            <h2 className="font-serif text-lg font-semibold text-ink">{item.titel}</h2>
                            <p className="mt-1 text-sm text-muted">{item.beschrijving}</p>
                            <p className={`mt-2 text-xs font-medium ${item.status === 'GELEZEN' ? 'text-success' : 'text-accent'}`}>
                                {item.status === 'GELEZEN' ? 'Gelezen' : 'Nog niet gelezen'}
                            </p>
                            <div className="mt-4">
                                <Button variant="secondary" onClick={() => handleToggle(item.id)}>
                                    {item.status === 'GELEZEN' ? 'Markeer als niet gelezen' : 'Markeer als gelezen'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
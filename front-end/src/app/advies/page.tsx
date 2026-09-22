'use client';

import { AddToLeeslijstButton } from "@/components/AddToLeeslijstButton";
import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/Skeleton";

type Suggestion = {
    catalogusItemId: string,
    titel: string,
    beschrijving: string,
    motivatie: string;
}

export default function AdviesPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        async function loadSuggestions() {
            setLoading(true);
            setErr('')

            try {
                const data = await apiFetch<Suggestion[]>('/advies');
                setSuggestions(data);
            } catch (err) {
                if (err instanceof Error) {
                    setErr(err.message);
                } else {
                    setErr('Er is iets mis gegaan.')
                }
            } finally {
                setLoading(false);
            }
        }

        loadSuggestions();
    }, [])

    if (loading) {
        return <Skeleton lines={4} />;
    }

    return (
        <div>
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Jouw leesadvies</h1>

            {err && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {err}
                </p>
            )}

            {!err && suggestions.length === 0 && (
                <p className="text-sm text-muted">Geen suggesties gevonden.</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex flex-col rounded-lg border border-brand-soft bg-white p-4 shadow-sm">
                        <h2 className="font-serif text-lg font-semibold text-ink">{suggestion.titel}</h2>
                        <p className="mt-1 text-sm text-muted">{suggestion.beschrijving}</p>
                        <p className="mt-3 text-sm italic text-accent">{suggestion.motivatie}</p>
                        <div className="mt-4">
                            <AddToLeeslijstButton catalogusItemId={suggestion.catalogusItemId} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
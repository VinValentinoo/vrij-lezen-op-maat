'use client';

import { AddToLeeslijstButton } from "@/components/AddToLeeslijstButton";
import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";

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

    if(loading) {
        return <h1 className="text-xl font-semibold">Loading...</h1>
    } else {
        return (
            <div>
                <h1 className="text-xl font-semibold">Advies pagina</h1>
                {err && <p role="alert">{err}</p>}

                {suggestions.map((suggestion, index) => (
                    <div key={index}>
                        <h2>{suggestion.titel}</h2>
                        <p>{suggestion.beschrijving}</p>
                        <p>{suggestion.motivatie}</p>
                        <AddToLeeslijstButton catalogusItemId={suggestion.catalogusItemId}/>
                    </div>
                ))}
            </div>
        )
    }
}
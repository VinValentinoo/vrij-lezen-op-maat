'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";

type Leeslijst = {
    _id: string;
    userId: string;
    catalogusItemId: string;
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

    if (loading) {
        return <h1 className="text-xl font-semibold">Loading...</h1>
    } else {
        return (
            <div>
                <h1 className="text-xl font-semibold">Leeslijst</h1>
                {err && <p role="alert">{err}</p>}

            </div>
        )
    }
}

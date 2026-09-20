'use client';

import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Student = {
    id: string;
    user: {
        id: string;
        naam: string;
        email: string;
    };
};

type LeeslijstItem = {
    id: string;
    titel: string;
    beschrijving: string;
    status: 'NIET_GELEZEN' | 'GELEZEN';
};

export default function DocentPage() {
    const { user, loading } = useCurrentUser();
    const router = useRouter();

    const [studenten, setStudenten] = useState<Student[]>([]);
    const [studentenLoading, setStudentenLoading] = useState(true);
    const [err, setErr] = useState('');

    const [geselecteerdeStudentId, setGeselecteerdeStudentId] = useState<string | null>(null);
    const [leeslijst, setLeeslijst] = useState<LeeslijstItem[]>([]);
    const [leeslijstLoading, setLeeslijstLoading] = useState(false);
    const [leeslijstErr, setLeeslijstErr] = useState('');

    const [nieuwCatalogusItemId, setNieuwCatalogusItemId] = useState('');
    const [toevoegErr, setToevoegErr] = useState('');
    const [toevoegSucces, setToevoegSucces] = useState(false);

    useEffect(() => {
        if (!loading && user?.role !== 'DOCENT') {
            router.push('/');
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (loading || user?.role !== 'DOCENT') return;

        async function loadStudenten() {
            setStudentenLoading(true);
            setErr('');

            try {
                const data = await apiFetch<Student[]>('/docent');
                setStudenten(data);
            } catch (err) {
                if (err instanceof Error) {
                    setErr(err.message);
                } else {
                    setErr('Er is iets mis gegaan.');
                }
            } finally {
                setStudentenLoading(false);
            }
        }

        loadStudenten();
    }, [loading, user]);

    async function bekijkLeeslijst(studentId: string) {
        setGeselecteerdeStudentId(studentId);
        setLeeslijstLoading(true);
        setLeeslijstErr('');
        setToevoegSucces(false);

        try {
            const data = await apiFetch<LeeslijstItem[]>(`/docent/${studentId}/leeslijst`);
            setLeeslijst(data);
        } catch (err) {
            if (err instanceof Error) {
                setLeeslijstErr(err.message);
            } else {
                setLeeslijstErr('Er is iets mis gegaan.');
            }
        } finally {
            setLeeslijstLoading(false);
        }
    }

    async function handleToevoegen(e: React.FormEvent) {
        e.preventDefault();
        if (!geselecteerdeStudentId) return;

        setToevoegErr('');
        setToevoegSucces(false);

        try {
            await apiFetch(`/docent/${geselecteerdeStudentId}/leeslijst`, {
                method: 'POST',
                body: JSON.stringify({ catalogusItemId: nieuwCatalogusItemId }),
            });
            setToevoegSucces(true);
            setNieuwCatalogusItemId('');
            bekijkLeeslijst(geselecteerdeStudentId);
        } catch (err) {
            if (err instanceof Error) {
                setToevoegErr(err.message);
            } else {
                setToevoegErr('Er is iets mis gegaan.');
            }
        }
    }

    if (loading) return <p>Laden...</p>;
    if (user?.role !== 'DOCENT') return null;

    return (
        <div>
            <h1 className="text-xl font-semibold">Docentoverzicht</h1>

            {err && <p role="alert">{err}</p>}
            {studentenLoading && <p>Studenten laden...</p>}

            {!studentenLoading && studenten.length === 0 && (
                <p>Er zijn nog geen studenten aan jou gekoppeld.</p>
            )}

            <ul>
                {studenten.map((s) => (
                    <li key={s.id}>
                        <span>{s.user.naam} ({s.user.email})</span>
                        <button onClick={() => bekijkLeeslijst(s.user.id)}>
                            Bekijk leeslijst
                        </button>
                    </li>
                ))}
            </ul>

            {geselecteerdeStudentId && (
                <div>
                    <h2 className="text-lg font-semibold">Leeslijst</h2>

                    {leeslijstLoading && <p>Leeslijst laden...</p>}
                    {leeslijstErr && <p role="alert">{leeslijstErr}</p>}

                    {!leeslijstLoading && leeslijst.length === 0 && (
                        <p>Deze student heeft nog geen boeken op zijn/haar leeslijst.</p>
                    )}

                    <ul>
                        {leeslijst.map((item) => (
                            <li key={item.id}>
                                <h3>{item.titel}</h3>
                                <p>{item.beschrijving}</p>
                                <p>{item.status === 'GELEZEN' ? 'Gelezen' : 'Nog niet gelezen'}</p>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleToevoegen}>
                        <div>
                            <label htmlFor="catalogusItemId">
                                Catalogus item-ID toevoegen (te vinden bij een boek op /catalogus)
                            </label>
                            <input
                                id="catalogusItemId"
                                type="text"
                                value={nieuwCatalogusItemId}
                                onChange={(e) => setNieuwCatalogusItemId(e.target.value)}
                                required
                            />
                        </div>
                        {toevoegSucces && <p role="status">Toegevoegd aan de leeslijst.</p>}
                        {toevoegErr && <p role="alert">{toevoegErr}</p>}
                        <button type="submit">Toevoegen aan leeslijst</button>
                    </form>
                </div>
            )}
        </div>
    );
}
'use client';

import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";

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

const inputClass =
    "w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const labelClass = "mb-1 block text-sm font-medium text-ink";

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

    if (loading) return <Skeleton lines={3} />;
    if (user?.role !== 'DOCENT') return null;

    return (
        <div>
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Docentoverzicht</h1>

            {err && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {err}
                </p>
            )}

            {studentenLoading ? (
                <Skeleton lines={3} />
            ) : (
                <>
                    {studenten.length === 0 && (
                        <p className="text-sm text-muted">Er zijn nog geen studenten aan jou gekoppeld.</p>
                    )}

                    <ul className="mb-8 divide-y divide-brand-soft rounded-lg border border-brand-soft bg-white">
                        {studenten.map((s) => (
                            <li key={s.id} className="flex items-center justify-between px-4 py-3">
                                <span className="text-sm text-ink">
                                    {s.user.naam} <span className="text-muted">({s.user.email})</span>
                                </span>
                                <Button variant="secondary" onClick={() => bekijkLeeslijst(s.user.id)}>
                                    Bekijk leeslijst
                                </Button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {geselecteerdeStudentId && (
                <div className="rounded-lg border border-brand-soft bg-white p-4">
                    <h2 className="font-serif text-lg font-semibold text-ink mb-4">Leeslijst</h2>

                    {leeslijstLoading ? (
                        <Skeleton lines={2} />
                    ) : (
                        <>
                            {leeslijstErr && (
                                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {leeslijstErr}
                                </p>
                            )}

                            {leeslijst.length === 0 && (
                                <p className="mb-4 text-sm text-muted">
                                    Deze student heeft nog geen boeken op zijn/haar leeslijst.
                                </p>
                            )}

                            <ul className="mb-6 space-y-3">
                                {leeslijst.map((item) => (
                                    <li key={item.id} className="rounded-md border border-brand-soft p-3">
                                        <h3 className="text-sm font-semibold text-ink">{item.titel}</h3>
                                        <p className="mt-1 text-sm text-muted">{item.beschrijving}</p>
                                        <p className="mt-2 text-xs font-medium text-accent">
                                            {item.status === 'GELEZEN' ? 'Gelezen' : 'Nog niet gelezen'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <form onSubmit={handleToevoegen}>
                        <div className="mb-4">
                            <label htmlFor="catalogusItemId" className={labelClass}>
                                Catalogus item-ID toevoegen (te vinden bij een boek op /catalogus)
                            </label>
                            <input
                                id="catalogusItemId"
                                type="text"
                                className={inputClass}
                                value={nieuwCatalogusItemId}
                                onChange={(e) => setNieuwCatalogusItemId(e.target.value)}
                                required
                            />
                        </div>
                        {toevoegSucces && (
                            <p role="status" className="mb-4 rounded-md bg-success-soft px-3 py-2 text-sm text-success">
                                Toegevoegd aan de leeslijst.
                            </p>
                        )}
                        {toevoegErr && (
                            <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                                {toevoegErr}
                            </p>
                        )}
                        <Button type="submit">Toevoegen aan leeslijst</Button>
                    </form>
                </div>
            )}
        </div>
    );
}
'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/api-error';
import { docentControllerAddToStudentLeeslijst } from '@/lib/generated';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';

export type Boek = { id: string; titel: string };

type Props = {
    studentId: string;
    // De titels komen van de server component (catalogus is publiek en gecachet).
    boeken: Boek[];
};

// Eén verantwoordelijkheid: een boek kiezen en aan de leeslijst van de student toevoegen.
// Zoeken gaat via de native <datalist>: toetsenbord- en schermlezer-ondersteuning
// zit dan in de browser, zonder eigen combobox-ARIA.
export function BoekToevoegen({ studentId, boeken }: Props) {
    const router = useRouter();
    const [zoekterm, setZoekterm] = useState('');
    const [bezig, setBezig] = useState(false);
    const [err, setErr] = useState('');
    const [succes, setSucces] = useState(false);

    const gekozenBoek = useMemo(
        () => boeken.find((boek) => boek.titel === zoekterm.trim()),
        [boeken, zoekterm],
    );

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!gekozenBoek) return;

        setErr('');
        setSucces(false);
        setBezig(true);

        try {
            await docentControllerAddToStudentLeeslijst(studentId, { catalogusItemId: gekozenBoek.id });
            setSucces(true);
            setZoekterm('');
            router.refresh(); // leeslijst (server component) opnieuw ophalen
        } catch (error) {
            setErr(getErrorMessage(error));
        } finally {
            setBezig(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 max-w-md">
            <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Boek toevoegen</h2>

            <TextField
                id="boekZoeken"
                label="Zoek een boek op titel"
                list="boeken-lijst"
                value={zoekterm}
                onChange={(e) => setZoekterm(e.target.value)}
                placeholder="Typ een boektitel..."
                autoComplete="off"
                aria-describedby="boek-hint"
            />
            <datalist id="boeken-lijst">
                {boeken.map((boek) => (
                    <option key={boek.id} value={boek.titel} />
                ))}
            </datalist>
            <p id="boek-hint" className="-mt-2 mb-4 text-xs text-muted">
                Kies een titel uit de suggesties om de knop te activeren.
            </p>

            {succes && <Alert variant="success">Boek toegevoegd aan de leeslijst.</Alert>}
            {err && <Alert>{err}</Alert>}

            <Button type="submit" disabled={!gekozenBoek || bezig}>
                Toevoegen aan leeslijst
            </Button>
        </form>
    );
}

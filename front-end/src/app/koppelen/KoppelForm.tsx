'use client';

import { FormEvent, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { getErrorMessage } from '@/lib/api-error';
import { koppelingControllerKoppelAanDocent } from '@/lib/generated';
import type { DocentDto } from '@/lib/generated/models';

export function KoppelForm({ docenten }: { docenten: DocentDto[] }) {
    const [gekozenDocentId, setGekozenDocentId] = useState('');
    const [err, setErr] = useState('');
    const [succes, setSucces] = useState(false);
    const [bezig, setBezig] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErr('');
        setSucces(false);
        setBezig(true);

        try {
            await koppelingControllerKoppelAanDocent({ docentId: gekozenDocentId });
            setSucces(true);
        } catch (error) {
            setErr(getErrorMessage(error));
        } finally {
            setBezig(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {succes && <Alert variant="success">Je bent nu gekoppeld aan je docent.</Alert>}
            {err && <Alert>{err}</Alert>}

            <SelectField
                id="docent"
                label="Kies je docent"
                options={docenten.map((docent) => ({
                    value: docent.id,
                    label: `${docent.naam} (${docent.email})`,
                }))}
                emptyLabel="Maak een keuze"
                emptyDisabled
                value={gekozenDocentId}
                onChange={(e) => setGekozenDocentId(e.target.value)}
                required
            />
            <Button type="submit" disabled={bezig}>
                Koppelen
            </Button>
        </form>
    );
}

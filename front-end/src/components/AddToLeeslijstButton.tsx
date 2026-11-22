'use client';

import { useState } from 'react';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { leeslijstControllerAddToLeeslijst } from '@/lib/generated';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';

type Props = {
    catalogusItemId: string;
};

export function AddToLeeslijstButton({ catalogusItemId }: Props) {
    const [added, setAdded] = useState(false);
    const [err, setErr] = useState('');

    async function handleClick() {
        setErr('');

        try {
            await leeslijstControllerAddToLeeslijst({ catalogusItemId });

            setAdded(true);
        } catch (error) {
            // 409 Conflict = staat al op de leeslijst. Dat herkennen we aan de
            // statuscode in plaats van aan de tekst van de foutmelding.
            if (error instanceof ApiError && error.status === 409) {
                setAdded(true);
            } else {
                setErr(getErrorMessage(error));
            }
        }
    }

    return (
        <div>
            <Button onClick={handleClick} disabled={added}>
                {added ? '✓ Toegevoegd' : 'Toevoegen aan leeslijst'}
            </Button>
            {err && <Alert className="mt-2">{err}</Alert>}
        </div>
    );
}

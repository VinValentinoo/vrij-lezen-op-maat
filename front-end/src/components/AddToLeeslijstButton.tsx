'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { Button } from './ui/Button';

type Props = {
  catalogusItemId: string;
};

export function AddToLeeslijstButton({ catalogusItemId }: Props) {
    const [added, setAdded] = useState(false);
    const [err, setErr] = useState('');

    async function handleClick() {
        setErr('')

        try {
            await apiFetch<unknown>('/leeslijst', {
                method: 'POST',
                body: JSON.stringify({ catalogusItemId })
            });

            setAdded(true);
        } catch(err) {
            if (err instanceof Error && err.message.includes('al op je leeslijst')) {
                setAdded(true);
            } else if(err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan')
            }
        }
    }

    return (
        <div>
            <Button onClick={handleClick} disabled={added}>
                {added ? '✓ Toegevoegd': 'Toevoegen aan leeslijst'}
            </Button>
            {err && <p role='alert'>{err}</p>}
        </div>
    );
}
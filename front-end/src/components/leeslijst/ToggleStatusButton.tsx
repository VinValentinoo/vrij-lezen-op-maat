'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/api-error';
import type { LeesStatus } from '@/lib/types';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

type Props = {
    id: string;
    status: LeesStatus;
};

// Kleine client component binnen een server component: de leeslijst zelf wordt op
// de server opgehaald. Na de PATCH vraagt router.refresh() Next.js om de server
// component opnieuw te renderen met verse data (geen eigen lijst-state nodig).
export function ToggleStatusButton({ id, status }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [err, setErr] = useState('');

    async function handleClick() {
        setErr('');

        try {
            await apiFetch(`/leeslijst/${id}/toggle`, { method: 'PATCH' });
            startTransition(() => router.refresh());
        } catch (error) {
            setErr(getErrorMessage(error));
        }
    }

    return (
        <div>
            <Button variant="secondary" onClick={handleClick} disabled={pending}>
                {status === 'GELEZEN' ? 'Markeer als niet gelezen' : 'Markeer als gelezen'}
            </Button>
            {err && <Alert className="mt-2">{err}</Alert>}
        </div>
    );
}

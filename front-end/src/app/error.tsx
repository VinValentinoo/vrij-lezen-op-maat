'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { PageTitle } from '@/components/ui/PageTitle';

// Error boundary van de App Router: vangt fouten uit server components (bv. de
// API is onbereikbaar) en toont een nette melding in plaats van een lege pagina.
// De Navbar blijft staan, want deze boundary zit binnen de root layout.
export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div role="alert">
            <PageTitle>Er is iets misgegaan</PageTitle>
            <p className="mb-4 text-sm text-muted">
                De gegevens konden niet worden opgehaald. Controleer je verbinding en probeer het opnieuw.
            </p>
            <Button onClick={reset}>Opnieuw proberen</Button>
        </div>
    );
}

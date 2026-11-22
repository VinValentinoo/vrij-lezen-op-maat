'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        console.error(error);
    }, [error]);

    // reset() alleen probeert de boundary opnieuw te tonen met de OUDE server-uitkomst,
    // dus er gebeurt niets. router.refresh() haalt de server components opnieuw op;
    // samen in een transition vervangt Next de foutmelding pas als dat gelukt is.
    function opnieuwProberen() {
        startTransition(() => {
            router.refresh();
            reset();
        });
    }

    return (
        <div role="alert">
            <PageTitle>Er is iets misgegaan</PageTitle>
            <p className="mb-4 text-sm text-muted">
                De gegevens konden niet worden opgehaald. Controleer je verbinding en probeer het opnieuw.
            </p>
            <Button onClick={opnieuwProberen} disabled={pending}>
                Opnieuw proberen
            </Button>
        </div>
    );
}

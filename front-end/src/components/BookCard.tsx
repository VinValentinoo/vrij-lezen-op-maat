import { ReactNode } from 'react';
import type { LeesStatus } from '@/lib/types';

type BookCardProps = {
    titel: string;
    beschrijving: string;
    // Advies: waarom deze titel past bij het leesprofiel.
    motivatie?: string;
    // Leeslijst: gelezen of nog niet.
    status?: LeesStatus;
    // Actie onderaan de kaart (knop).
    children?: ReactNode;
};

// Eén kaart voor catalogus, advies, leeslijst en docentweergave. Eerst stond
// deze markup in vier pagina's; nu is het één component met één verantwoordelijkheid:
// een boek tonen.
export function BookCard({ titel, beschrijving, motivatie, status, children }: BookCardProps) {
    return (
        <article className="flex flex-col rounded-lg border border-brand-soft bg-white p-4 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-ink">{titel}</h2>
            <p className="mt-1 text-sm text-muted">{beschrijving}</p>

            {motivatie && <p className="mt-3 text-sm italic text-accent-text">{motivatie}</p>}

            {status && (
                <p
                    className={`mt-2 text-xs font-medium ${
                        status === 'GELEZEN' ? 'text-success-dark' : 'text-accent-text'
                    }`}
                >
                    {status === 'GELEZEN' ? 'Gelezen' : 'Nog niet gelezen'}
                </p>
            )}

            {children && <div className="mt-4">{children}</div>}
        </article>
    );
}

export function BookGrid({ children }: { children: ReactNode }) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

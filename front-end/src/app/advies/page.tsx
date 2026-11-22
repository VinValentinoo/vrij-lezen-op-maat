import type { Metadata } from 'next';
import { AddToLeeslijstButton } from '@/components/AddToLeeslijstButton';
import { BookCard, BookGrid } from '@/components/BookCard';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageTitle } from '@/components/ui/PageTitle';
import { ApiError } from '@/lib/api-error';
import { unwrap } from '@/lib/api-result';
import { adviesControllerGetAdvies } from '@/lib/generated-server';
import type { AdviesItemDto } from '@/lib/generated/models';

export const metadata: Metadata = { title: 'Leesadvies' };

export default async function AdviesPage() {
    let suggestions: AdviesItemDto[];

    try {
        suggestions = unwrap(await adviesControllerGetAdvies());
    } catch (error) {
        // Lege staat: de gebruiker heeft nog geen leesprofiel (de API geeft 404).
        if (error instanceof ApiError && error.status === 404) {
            return (
                <div>
                    <PageTitle>Jouw leesadvies</PageTitle>
                    <p className="mb-4 text-sm text-muted">
                        Je hebt nog geen leesprofiel. Vul eerst je leesprofiel in om advies te krijgen.
                    </p>
                    <ButtonLink href="/profiel">Leesprofiel invullen</ButtonLink>
                </div>
            );
        }
        // Alles anders (ook de redirect naar /login) gaat naar de error boundary.
        throw error;
    }

    return (
        <div>
            <PageTitle>Jouw leesadvies</PageTitle>

            {suggestions.length === 0 ? (
                <p className="text-sm text-muted">Geen suggesties gevonden.</p>
            ) : (
                <BookGrid>
                    {suggestions.map((suggestion) => (
                        <BookCard
                            key={suggestion.catalogusItemId}
                            titel={suggestion.titel}
                            beschrijving={suggestion.beschrijving}
                            motivatie={suggestion.motivatie}
                        >
                            <AddToLeeslijstButton catalogusItemId={suggestion.catalogusItemId} />
                        </BookCard>
                    ))}
                </BookGrid>
            )}
        </div>
    );
}

import type { Metadata } from 'next';
import { BookCard, BookGrid } from '@/components/BookCard';
import { ToggleStatusButton } from '@/components/leeslijst/ToggleStatusButton';
import { PageTitle } from '@/components/ui/PageTitle';
import { unwrap } from '@/lib/api-result';
import { leeslijstControllerGetLeeslijst } from '@/lib/generated-server';

export const metadata: Metadata = { title: 'Leeslijst' };

export default async function LeeslijstPage() {
    const leeslijst = unwrap(await leeslijstControllerGetLeeslijst());

    return (
        <div>
            <PageTitle>Leeslijst</PageTitle>

            {leeslijst.length === 0 ? (
                <p className="text-sm text-muted">Je leeslijst is nog leeg.</p>
            ) : (
                <BookGrid>
                    {leeslijst.map((item) => (
                        <BookCard
                            key={item.id}
                            titel={item.titel ?? 'Onbekende titel'}
                            beschrijving={item.beschrijving ?? ''}
                            status={item.status}
                        >
                            <ToggleStatusButton id={item.id} status={item.status} />
                        </BookCard>
                    ))}
                </BookGrid>
            )}
        </div>
    );
}

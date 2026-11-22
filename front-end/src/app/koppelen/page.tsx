import type { Metadata } from 'next';
import { PageTitle } from '@/components/ui/PageTitle';
import { unwrap } from '@/lib/api-result';
import { koppelingControllerGetDocenten } from '@/lib/generated-server';
import { KoppelForm } from './KoppelForm';

export const metadata: Metadata = { title: 'Koppelen aan docent' };

export default async function KoppelenPage() {
    const docenten = unwrap(await koppelingControllerGetDocenten());

    return (
        <div className="max-w-md">
            <PageTitle>Koppel aan een docent</PageTitle>

            {docenten.length === 0 ? (
                <p className="text-sm text-muted">
                    Er zijn nog geen docenten beschikbaar om aan te koppelen.
                </p>
            ) : (
                <KoppelForm docenten={docenten} />
            )}
        </div>
    );
}

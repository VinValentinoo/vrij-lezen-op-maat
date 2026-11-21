import type { Metadata } from 'next';
import { PageTitle } from '@/components/ui/PageTitle';
import { serverFetch } from '@/lib/api-server';
import type { Docent } from '@/lib/types';
import { KoppelForm } from './KoppelForm';

export const metadata: Metadata = { title: 'Koppelen aan docent' };

export default async function KoppelenPage() {
    const docenten = await serverFetch<Docent[]>('/koppeling', { auth: true });

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

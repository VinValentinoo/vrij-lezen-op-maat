import type { Metadata } from 'next';
import { serverFetch } from '@/lib/api-server';
import type { Profile } from '@/lib/types';
import { ProfielForm } from './ProfielForm';

export const metadata: Metadata = { title: 'Leesprofiel' };

export default async function ProfielPage() {
    // null = nog geen leesprofiel: het formulier staat dan in "aanmaken"-modus.
    const profiel = await serverFetch<Profile | null>('/profile', { auth: true });

    return (
        <div className="max-w-md">
            <ProfielForm initial={profiel} />
        </div>
    );
}

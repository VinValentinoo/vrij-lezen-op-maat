import type { Metadata } from 'next';
import { unwrap } from '@/lib/api-result';
import { profileControllerGetProfile } from '@/lib/generated-server';
import { ProfielForm } from './ProfielForm';

export const metadata: Metadata = { title: 'Leesprofiel' };

export default async function ProfielPage() {
    // De API geeft een lege body (null) zonder leesprofiel: het formulier staat dan in "aanmaken"-modus.
    const profiel = unwrap(await profileControllerGetProfile()) ?? null;

    return (
        <div className="max-w-md">
            <ProfielForm initial={profiel} />
        </div>
    );
}

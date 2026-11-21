'use client';

import { FormEvent, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { PageTitle } from '@/components/ui/PageTitle';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { apiFetch } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/api-error';
import { GENRES, LENGTES, ONDERWERPEN, TAALNIVEAUS } from '@/lib/opties';
import type { Profile } from '@/lib/types';

const LEEG_PROFIEL: Profile = { taalniveau: '', genre: '', onderwerp: '', lengte: '', leesdoel: '' };

// De API stuurt ook id, userId en updatedAt mee; het formulier gebruikt alleen deze velden.
const kiesVelden = (p: Profile): Profile => ({
    taalniveau: p.taalniveau,
    genre: p.genre,
    onderwerp: p.onderwerp,
    lengte: p.lengte,
    leesdoel: p.leesdoel,
});

// Client component omdat dit een formulier met state is. De beginwaarden komen
// van de server component (profiel/page.tsx), dus er is geen useEffect-fetch of
// laad-flits meer.
export function ProfielForm({ initial }: { initial: Profile | null }) {
    const [profile, setProfile] = useState<Profile>(initial ? kiesVelden(initial) : LEEG_PROFIEL);
    const [profileExists, setProfileExists] = useState(initial !== null);
    const [bezig, setBezig] = useState(false);
    const [err, setErr] = useState('');
    const [succes, setSucces] = useState(false);

    function wijzig(veld: keyof Profile, waarde: string) {
        setProfile((huidig) => ({ ...huidig, [veld]: waarde }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErr('');
        setSucces(false);
        setBezig(true);

        try {
            const data = await apiFetch<Profile>('/profile', {
                method: 'PUT',
                body: JSON.stringify(profile),
            });
            setProfile(kiesVelden(data));
            setProfileExists(true);
            setSucces(true);
        } catch (error) {
            setErr(getErrorMessage(error));
        } finally {
            setBezig(false);
        }
    }

    return (
        <>
            <PageTitle>{profileExists ? 'Leesprofiel bewerken' : 'Leesprofiel aanmaken'}</PageTitle>

            <form onSubmit={handleSubmit}>
                <SelectField
                    id="taalniveau"
                    label="Taalniveau"
                    options={TAALNIVEAUS}
                    emptyLabel="Maak een keuze"
                    emptyDisabled
                    value={profile.taalniveau}
                    onChange={(e) => wijzig('taalniveau', e.target.value)}
                    required
                />
                <SelectField
                    id="genre"
                    label="Genre"
                    options={GENRES}
                    emptyLabel="Maak een keuze"
                    emptyDisabled
                    value={profile.genre}
                    onChange={(e) => wijzig('genre', e.target.value)}
                    required
                />
                <SelectField
                    id="onderwerp"
                    label="Onderwerp"
                    options={ONDERWERPEN}
                    emptyLabel="Maak een keuze"
                    emptyDisabled
                    value={profile.onderwerp}
                    onChange={(e) => wijzig('onderwerp', e.target.value)}
                    required
                />
                <SelectField
                    id="lengte"
                    label="Lengte"
                    options={LENGTES}
                    emptyLabel="Maak een keuze"
                    emptyDisabled
                    value={profile.lengte}
                    onChange={(e) => wijzig('lengte', e.target.value)}
                    required
                />
                <TextField
                    id="leesdoel"
                    label="Leesdoel"
                    type="text"
                    value={profile.leesdoel}
                    onChange={(e) => wijzig('leesdoel', e.target.value)}
                    required
                />

                {succes && <Alert variant="success">Je leesprofiel is opgeslagen.</Alert>}
                {err && <Alert>{err}</Alert>}

                <Button type="submit" disabled={bezig}>
                    {profileExists ? 'Bewerken' : 'Aanmaken'}
                </Button>
            </form>
        </>
    );
}

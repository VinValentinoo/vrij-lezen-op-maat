'use client';

import { FormEvent, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { PageTitle } from '@/components/ui/PageTitle';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { getErrorMessage } from '@/lib/api-error';
import { unwrap } from '@/lib/api-result';
import { profileControllerUpsertProfile } from '@/lib/generated';
import type { ReadingProfileResponseDto, UpdateProfileDto } from '@/lib/generated/models';
import { GENRES, LENGTES, ONDERWERPEN, TAALNIVEAUS } from '@/lib/opties';

const LEEG_PROFIEL: UpdateProfileDto = { taalniveau: '', genre: '', onderwerp: '', lengte: '', leesdoel: '' };

// De API stuurt ook id, userId en updatedAt mee; het formulier gebruikt alleen deze velden.
const kiesVelden = (p: UpdateProfileDto): UpdateProfileDto => ({
    taalniveau: p.taalniveau,
    genre: p.genre,
    onderwerp: p.onderwerp,
    lengte: p.lengte,
    leesdoel: p.leesdoel,
});

// Client component omdat dit een formulier met state is. De beginwaarden komen
// van de server component (profiel/page.tsx), dus er is geen useEffect-fetch of
// laad-flits meer.
export function ProfielForm({ initial }: { initial: ReadingProfileResponseDto | null }) {
    const [profile, setProfile] = useState<UpdateProfileDto>(initial ? kiesVelden(initial) : LEEG_PROFIEL);
    const [profileExists, setProfileExists] = useState(initial !== null);
    const [bezig, setBezig] = useState(false);
    const [err, setErr] = useState('');
    const [succes, setSucces] = useState(false);

    function wijzig(veld: keyof UpdateProfileDto, waarde: string) {
        setProfile((huidig) => ({ ...huidig, [veld]: waarde }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErr('');
        setSucces(false);
        setBezig(true);

        try {
            const data = unwrap(await profileControllerUpsertProfile(profile));
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

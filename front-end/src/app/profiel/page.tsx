'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";

type Profile = {
    taalniveau: string,
    genre: string,
    onderwerp: string,
    lengte: string,
    leesdoel: string,
}

export default function ProfielPage() {
    const [profile, setProfile] = useState<Profile>({
        taalniveau: '',
        genre: '',
        onderwerp: '',
        lengte: '',
        leesdoel: '',
    });
    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);

            try {
                const data = await apiFetch<Profile | null>('/profile');

                if (!data) {
                    setErr('Geen leesprofiel gevonden.')
                } else {
                    setProfile(data)
                    setProfileExists(true);
                }

            } catch (err) {
                if (err instanceof Error) {
                    setErr(err.message);
                } else {
                    setErr('Er is iets mis gegaan.')
                }
            } finally {
                setLoading(false);
                setErr('');
            }
        }

        loadProfile();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr('');
        setLoading(true);

        try {
            const data = await apiFetch<Profile>('/profile', {
                method: 'PUT',
                body: JSON.stringify(profile)
            });
            setProfile(data);
            setProfileExists(true);
        } catch (err) {
            if(err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.')
            }
        } finally {
            setLoading(false);
            setErr('')
        }
    }

    if (loading) {
        return <h1>Loading...</h1>
    } else {
        return (
            <>
                {
                    profileExists ?
                        <h1 className="text-xl font-semibold">Leesprofiel bewerken</h1>
                        : <h1 className="text-xl font-semibold">Leesprofiel aanmaken</h1>
                }
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="taalniveau">Taalniveau</label>
                        <input
                            id="taalniveau"
                            type="text"
                            value={profile.taalniveau}
                            onChange={(e) => setProfile({ ...profile, taalniveau: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="genre">Genre</label>
                        <input
                            id="genre"
                            type="text"
                            value={profile.genre}
                            onChange={(e) => setProfile({ ...profile, genre: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="onderwerp">Onderwerp</label>
                        <input
                            id="onderwerp"
                            type="text"
                            value={profile.onderwerp}
                            onChange={(e) => setProfile({ ...profile, onderwerp: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lengte">Lengte</label>
                        <input
                            id="lengte"
                            type="text"
                            value={profile.lengte}
                            onChange={(e) => setProfile({ ...profile, lengte: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="leesdoel">Leesdoel</label>
                        <input
                            id="leesdoel"
                            type="text"
                            value={profile.leesdoel}
                            onChange={(e) => setProfile({ ...profile, leesdoel: e.target.value})}
                            required
                        />
                    </div>
                    {err && <p role="alert">{err}</p>}
                    {
                        profileExists ?
                            <button type="submit">Bewerken</button>
                            : <button type="submit">Aanmaken</button>
                    }
                </form>
            </>
        );
    }
}

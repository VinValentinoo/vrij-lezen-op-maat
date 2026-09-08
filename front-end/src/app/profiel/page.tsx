'use client';

import { apiFetch } from "@/lib/api-client";
import { getToken } from "@/lib/cookies";
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
        setLoading(true);
        setErr('');

        try {
            const data = await apiFetch<Profile>('/profile', {
                method: 'PUT',
                body: JSON.stringify(profile)
            });
            setProfile(data);
            setProfileExists(true);
        } catch (err) {
            if (err instanceof Error) {
                setErr(err.message);
            } else {
                setErr('Er is iets mis gegaan.')
            }
        } finally {
            setLoading(false);
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
                        <select
                            id="taalniveau"
                            value={profile.taalniveau}
                            onChange={(e) => setProfile({ ...profile, taalniveau: e.target.value })}
                        >
                            <option value="">Alle</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="genre">Genre</label>
                        <select
                            id="genre"
                            value={profile.genre}
                            onChange={(e) => setProfile({ ...profile, genre: e.target.value })}
                        >
                            <option value="">Alle</option>
                            <option value="Drama">Drama</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Romantiek">Romantiek</option>
                            <option value="Avontuur">Avontuur</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="onderwerp">Onderwerp</label>
                        <select
                            id="onderwerp"
                            value={profile.onderwerp}
                            onChange={(e) => setProfile({ ...profile, onderwerp: e.target.value })}
                        >
                            <option value="">Alle</option>
                            <option value="Familie">Familie</option>
                            <option value="Mysterie">Mysterie</option>
                            <option value="Liefde">Liefde</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lengte">Lengte</label>
                        <select
                            id="lengte"
                            value={profile.lengte}
                            onChange={(e) => setProfile({...profile, lengte: e.target.value})}
                        >
                            <option value="">Alle</option>
                            <option value="Kort">Kort</option>
                            <option value="Middel">Middel</option>
                            <option value="Lang">Lang</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="leesdoel">Leesdoel</label>
                        <input
                            id="leesdoel"
                            type="text"
                            value={profile.leesdoel}
                            onChange={(e) => setProfile({ ...profile, leesdoel: e.target.value })}
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

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
                            required
                        >
                            <option value="" disabled>Maak een keuze</option>
                            <option value="2F">2F</option>
                            <option value="2F-3F">2F-3F</option>
                            <option value="3F">3F</option>
                            <option value="3F+">3F+</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="genre">Genre</label>
                        <select
                            id="genre"
                            value={profile.genre}
                            onChange={(e) => setProfile({ ...profile, genre: e.target.value })}
                            required
                        >
                            <option value="" disabled>Maak een keuze</option>
                            <option value="Boek">Boek</option>
                            <option value="Boek - thriller">Boek - thriller</option>
                            <option value="Boek - roman">Boek - roman</option>
                            <option value="Dichtbundel">Dichtbundel</option>
                            <option value="Blogpost">Blogpost</option>
                            <option value="Online artikel">Online artikel</option>
                            <option value="Krant">Krant</option>
                            <option value="Tijdschrift">Tijdschrift</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="onderwerp">Onderwerp</label>
                        <select
                            id="onderwerp"
                            value={profile.onderwerp}
                            onChange={(e) => setProfile({ ...profile, onderwerp: e.target.value })}
                            required
                        >
                            <option value="" disabled>Maak een keuze</option>
                            <option value="algemeen">Algemeen</option>
                            <option value="liefde">Liefde</option>
                            <option value="oorlog">Oorlog</option>
                            <option value="thriller">Thriller</option>
                            <option value="familie">Familie</option>
                            <option value="identiteit">Identiteit</option>
                            <option value="ontmoeting">Ontmoeting</option>
                            <option value="vriendschap">Vriendschap</option>
                            <option value="macht">Macht</option>
                            <option value="reizen">Reizen</option>
                            <option value="migratie">Migratie</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="lengte">Lengte</label>
                        <select
                            id="lengte"
                            value={profile.lengte}
                            onChange={(e) => setProfile({...profile, lengte: e.target.value})}
                            required
                        >
                            <option value="" disabled>Maak een keuze</option>
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

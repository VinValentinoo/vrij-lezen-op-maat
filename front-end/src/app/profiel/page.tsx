'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";

type Profile = {
    taalniveau: string,
    genre: string,
    onderwerp: string,
    lengte: string,
    leesdoel: string,
}

const inputClass =
    "w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const labelClass = "mb-1 block text-sm font-medium text-ink";

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
        return <Skeleton lines={5} />;
    }

    return (
        <div className="max-w-md">
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">
                {profileExists ? 'Leesprofiel bewerken' : 'Leesprofiel aanmaken'}
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="taalniveau" className={labelClass}>Taalniveau</label>
                    <select
                        id="taalniveau"
                        className={inputClass}
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

                <div className="mb-4">
                    <label htmlFor="genre" className={labelClass}>Genre</label>
                    <select
                        id="genre"
                        className={inputClass}
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

                <div className="mb-4">
                    <label htmlFor="onderwerp" className={labelClass}>Onderwerp</label>
                    <select
                        id="onderwerp"
                        className={inputClass}
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

                <div className="mb-4">
                    <label htmlFor="lengte" className={labelClass}>Lengte</label>
                    <select
                        id="lengte"
                        className={inputClass}
                        value={profile.lengte}
                        onChange={(e) => setProfile({ ...profile, lengte: e.target.value })}
                        required
                    >
                        <option value="" disabled>Maak een keuze</option>
                        <option value="Kort">Kort</option>
                        <option value="Middel">Middel</option>
                        <option value="Lang">Lang</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="leesdoel" className={labelClass}>Leesdoel</label>
                    <input
                        id="leesdoel"
                        type="text"
                        className={inputClass}
                        value={profile.leesdoel}
                        onChange={(e) => setProfile({ ...profile, leesdoel: e.target.value })}
                        required
                    />
                </div>

                {err && (
                    <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                        {err}
                    </p>
                )}

                <Button type="submit">
                    {profileExists ? 'Bewerken' : 'Aanmaken'}
                </Button>
            </form>
        </div>
    );
}
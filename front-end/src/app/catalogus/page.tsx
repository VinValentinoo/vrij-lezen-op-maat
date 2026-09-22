'use client';

import { AddToLeeslijstButton } from "@/components/AddToLeeslijstButton";
import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";

type CatalogusItem = {
    _id: string;
    titel: string;
    beschrijving: string;
    taalniveau: string;
    genre: string;
    onderwerp: string;
    lengte: string;
};

type CatalogusResponse = {
    items: CatalogusItem[];
    total: number;
    page: number;
    pageSize: number;
};

type Filters = {
    taalniveau: string;
    genre: string;
    onderwerp: string;
    lengte: string;
};

const selectClass =
    "w-full rounded-md border border-brand-soft bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
const labelClass = "mb-1 block text-sm font-medium text-ink";

export default function CatalogusPage() {
    const [items, setItems] = useState<CatalogusItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<Filters>({
        taalniveau: '',
        genre: '',
        onderwerp: '',
        lengte: '',
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const totalPages = Math.ceil(total / pageSize);

    useEffect(() => {
        async function loadCatalogus() {
            setLoading(true);

            try {
                const params = new URLSearchParams();
                params.set('page', String(page));
                if (filters.taalniveau) params.set('taalniveau', filters.taalniveau);
                if (filters.genre) params.set('genre', filters.genre);
                if (filters.onderwerp) params.set('onderwerp', filters.onderwerp);
                if (filters.lengte) params.set('lengte', filters.lengte);

                const data = await apiFetch<CatalogusResponse>(`/catalogus?${params.toString()}`);

                setItems(data.items);
                setPageSize(data.pageSize);
                setTotal(data.total);
            } catch (err) {
                if (err instanceof Error) {
                    setErr(err.message);
                } else {
                    setErr('Er is iets mis gegaan.');
                }
            } finally {
                setLoading(false);
                setErr('');
            }
        };

        loadCatalogus();
    }, [page, filters]);

    function handleFilterChange(field: keyof Filters, value: string) {
        setFilters({ ...filters, [field]: value });
        setPage(1);
    }

    return (
        <div>
            <h1 className="font-serif text-2xl font-semibold text-ink mb-6">Catalogus</h1>

            {err && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {err}
                </p>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label htmlFor="taalniveau" className={labelClass}>Taalniveau</label>
                    <select
                        id="taalniveau"
                        className={selectClass}
                        value={filters.taalniveau}
                        onChange={(e) => handleFilterChange('taalniveau', e.target.value)}
                    >
                        <option value="">Alle</option>
                        <option value="2F">2F</option>
                        <option value="2F-3F">2F-3F</option>
                        <option value="3F">3F</option>
                        <option value="3F+">3F+</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="genre" className={labelClass}>Genre</label>
                    <select
                        id="genre"
                        className={selectClass}
                        value={filters.genre}
                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                    >
                        <option value="">Alle</option>
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
                    <label htmlFor="onderwerp" className={labelClass}>Onderwerp</label>
                    <select
                        id="onderwerp"
                        className={selectClass}
                        value={filters.onderwerp}
                        onChange={(e) => handleFilterChange('onderwerp', e.target.value)}
                    >
                        <option value="">Alle</option>
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
                    <label htmlFor="lengte" className={labelClass}>Lengte</label>
                    <select
                        id="lengte"
                        className={selectClass}
                        value={filters.lengte}
                        onChange={(e) => handleFilterChange('lengte', e.target.value)}
                    >
                        <option value="">Alle</option>
                        <option value="Kort">Kort</option>
                        <option value="Middel">Middel</option>
                        <option value="Lang">Lang</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <Skeleton lines={4} />
            ) : (
                <>
                    {items.length === 0 && (
                        <p className="text-sm text-muted">Geen titels gevonden met deze filters.</p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <div key={item._id} className="flex flex-col rounded-lg border border-brand-soft bg-white p-4 shadow-sm">
                                <h2 className="font-serif text-lg font-semibold text-ink">{item.titel}</h2>
                                <p className="mt-1 text-sm text-muted">{item.beschrijving}</p>
                                <div className="mt-4">
                                    <AddToLeeslijstButton catalogusItemId={item._id} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-4">
                        <Button variant="secondary" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                            Vorige
                        </Button>
                        <span className="text-sm text-muted">Pagina {page} van {totalPages}</span>
                        <Button variant="secondary" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                            Volgende
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
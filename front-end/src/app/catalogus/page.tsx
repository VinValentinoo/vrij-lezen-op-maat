'use client';

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";

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
            <h1 className="text-xl font-semibold">Catalogus</h1>
            {err && <p role="alert">{err}</p>}
            {loading && <p>Laden...</p>}

            <div>
                <div>
                    <label htmlFor="taalniveau">Taalniveau</label>
                    <select
                        id="taalniveau"
                        value={filters.taalniveau}
                        onChange={(e) => handleFilterChange('taalniveau', e.target.value)}
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
                        value={filters.genre}
                        onChange={(e) => handleFilterChange('genre', e.target.value)}
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
                        value={filters.onderwerp}
                        onChange={(e) => handleFilterChange('onderwerp', e.target.value)}
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

            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        <h2>{item.titel}</h2>
                        <p>{item.beschrijving}</p>
                    </li>
                ))}
            </ul>

            <div>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                >
                    Vorige
                </button>
                <span>Pagina {page} van {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    Volgende
                </button>
            </div>

        </div>
    )
}

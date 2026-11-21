import type { Metadata } from 'next';
import { AddToLeeslijstButton } from '@/components/AddToLeeslijstButton';
import { BookCard, BookGrid } from '@/components/BookCard';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageTitle } from '@/components/ui/PageTitle';
import { SelectField } from '@/components/ui/SelectField';
import { serverFetch } from '@/lib/api-server';
import { GENRES, LENGTES, ONDERWERPEN, TAALNIVEAUS } from '@/lib/opties';
import type { CatalogusPage as CatalogusData } from '@/lib/types';

export const metadata: Metadata = { title: 'Catalogus' };

type SearchParams = Record<string, string | string[] | undefined>;

const FILTERS = ['taalniveau', 'genre', 'onderwerp', 'lengte'] as const;
type FilterNaam = (typeof FILTERS)[number];

const eerste = (waarde: string | string[] | undefined) =>
    Array.isArray(waarde) ? waarde[0] : waarde;

// Alleen ingevulde waarden in de querystring.
function bouwQuery(waarden: Record<string, string>) {
    const params = new URLSearchParams();
    Object.entries(waarden).forEach(([sleutel, waarde]) => {
        if (waarde) params.set(sleutel, waarde);
    });
    return params.toString();
}

// Server Component: filters en paginanummer staan in de URL (searchParams), niet in
// useState. Daardoor werken de terugknop, een bladwijzer en het delen van een
// gefilterde lijst, en de data wordt op de server opgehaald (met Next.js fetch-cache).
export default async function CatalogusPage({ searchParams }: { searchParams: SearchParams }) {
    const filters = Object.fromEntries(
        FILTERS.map((naam) => [naam, eerste(searchParams[naam]) ?? '']),
    ) as Record<FilterNaam, string>;

    const page = Math.max(1, Number.parseInt(eerste(searchParams.page) ?? '1', 10) || 1);

    const data = await serverFetch<CatalogusData>(
        `/catalogus?${bouwQuery({ ...filters, page: String(page) })}`,
    );

    const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
    const paginaHref = (nummer: number) =>
        `/catalogus?${bouwQuery({ ...filters, page: String(nummer) })}`;

    return (
        <div>
            <PageTitle>Catalogus</PageTitle>

            {/* Gewoon GET-formulier: werkt zonder JavaScript en zet de filters in de URL. */}
            <form
                action="/catalogus"
                method="get"
                aria-label="Catalogus filteren"
                className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                <SelectField
                    id="taalniveau"
                    name="taalniveau"
                    label="Taalniveau"
                    options={TAALNIVEAUS}
                    emptyLabel="Alle"
                    defaultValue={filters.taalniveau}
                    wrapperClassName=""
                />
                <SelectField
                    id="genre"
                    name="genre"
                    label="Genre"
                    options={GENRES}
                    emptyLabel="Alle"
                    defaultValue={filters.genre}
                    wrapperClassName=""
                />
                <SelectField
                    id="onderwerp"
                    name="onderwerp"
                    label="Onderwerp"
                    options={ONDERWERPEN}
                    emptyLabel="Alle"
                    defaultValue={filters.onderwerp}
                    wrapperClassName=""
                />
                <SelectField
                    id="lengte"
                    name="lengte"
                    label="Lengte"
                    options={LENGTES}
                    emptyLabel="Alle"
                    defaultValue={filters.lengte}
                    wrapperClassName=""
                />
                <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
                    <Button type="submit">Filter toepassen</Button>
                    <ButtonLink href="/catalogus" variant="secondary">
                        Wis filters
                    </ButtonLink>
                </div>
            </form>

            {data.items.length === 0 ? (
                <p className="text-sm text-muted">Geen titels gevonden met deze filters.</p>
            ) : (
                <>
                    <BookGrid>
                        {data.items.map((item) => (
                            <BookCard key={item._id} titel={item.titel} beschrijving={item.beschrijving}>
                                <AddToLeeslijstButton catalogusItemId={item._id} />
                            </BookCard>
                        ))}
                    </BookGrid>

                    <nav aria-label="Paginering" className="mt-6 flex items-center justify-center gap-4">
                        {page > 1 ? (
                            <ButtonLink href={paginaHref(page - 1)} variant="secondary">
                                Vorige
                            </ButtonLink>
                        ) : (
                            <span aria-disabled="true" className="rounded-md bg-brand-soft px-4 py-2 font-medium text-brand opacity-50">
                                Vorige
                            </span>
                        )}
                        <span className="text-sm text-muted">
                            Pagina {page} van {totalPages}
                        </span>
                        {page < totalPages ? (
                            <ButtonLink href={paginaHref(page + 1)} variant="secondary">
                                Volgende
                            </ButtonLink>
                        ) : (
                            <span aria-disabled="true" className="rounded-md bg-brand-soft px-4 py-2 font-medium text-brand opacity-50">
                                Volgende
                            </span>
                        )}
                    </nav>
                </>
            )}
        </div>
    );
}

// De keuzelijsten voor het leesprofiel en de catalogusfilters. Eerst stond elke
// lijst twee keer in de code (profiel en catalogus); nu is dit de enige plek.

export type Optie = { value: string; label: string };

const gelijk = (waarden: string[]): Optie[] =>
    waarden.map((waarde) => ({ value: waarde, label: waarde }));

export const TAALNIVEAUS: Optie[] = gelijk(['2F', '2F-3F', '3F', '3F+']);

export const GENRES: Optie[] = gelijk([
    'Boek',
    'Boek - thriller',
    'Boek - roman',
    'Dichtbundel',
    'Blogpost',
    'Online artikel',
    'Krant',
    'Tijdschrift',
]);

export const ONDERWERPEN: Optie[] = [
    { value: 'algemeen', label: 'Algemeen' },
    { value: 'liefde', label: 'Liefde' },
    { value: 'oorlog', label: 'Oorlog' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'familie', label: 'Familie' },
    { value: 'identiteit', label: 'Identiteit' },
    { value: 'ontmoeting', label: 'Ontmoeting' },
    { value: 'vriendschap', label: 'Vriendschap' },
    { value: 'macht', label: 'Macht' },
    { value: 'reizen', label: 'Reizen' },
    { value: 'migratie', label: 'Migratie' },
];

export const LENGTES: Optie[] = gelijk(['Kort', 'Middel', 'Lang']);

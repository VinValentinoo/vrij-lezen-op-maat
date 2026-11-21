// Handgeschreven API-types voor de pagina's die (nog) niet op de gegenereerde
// Orval-client draaien. Eén plek i.p.v. een kopie per pagina.

export type Role = 'STUDENT' | 'DOCENT';
export type LeesStatus = 'NIET_GELEZEN' | 'GELEZEN';

export type CurrentUser = {
    userId: string;
    naam: string;
    role: Role;
};

export type Profile = {
    taalniveau: string;
    genre: string;
    onderwerp: string;
    lengte: string;
    leesdoel: string;
};

export type CatalogusItem = {
    _id: string;
    titel: string;
    beschrijving: string;
    taalniveau: string;
    genre: string;
    onderwerp: string;
    lengte: string;
};

export type CatalogusPage = {
    items: CatalogusItem[];
    total: number;
    page: number;
    pageSize: number;
};

export type Suggestion = {
    catalogusItemId: string;
    titel: string;
    beschrijving: string;
    motivatie: string;
};

export type LeeslijstItem = {
    id: string;
    status: LeesStatus;
    titel?: string;
    beschrijving?: string;
};

export type Docent = {
    id: string;
    naam: string;
    email: string;
};

export type Student = {
    id: string;
    user: {
        id: string;
        naam: string;
        email: string;
    };
};

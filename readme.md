# Vrij lezen op maat — Proof of Concept

Van mini-leesprofiel naar drie onderbouwde leesadviezen.

## Mappenstructuur

```
/.docs        Architectuurdiagram, ERD en overige documentatie
/back-end     NestJS API (TypeScript)
/front-end    Next.js applicatie (TypeScript)
/readme.md    Dit bestand
```

## Techstack

| Laag | Keuze | Kort waarom |
|---|---|---|
| Front-end | Next.js (App Router) + React + TypeScript + Tailwind CSS | Ingebouwde routing, client/server components, snel te stylen |
| Back-end | NestJS + TypeScript | Losse server-side eis van de opdracht; modulaire architectuur sluit aan bij NFR1 |
| Relationele database | PostgreSQL via Prisma | Transactionele, sterk gerelateerde data: gebruikers, leesprofiel, leeslijst, student-docent-koppeling (NFR7) |
| Document store | MongoDB via Mongoose | Catalogus met wisselende metadata (NFR7); geen foreign keys nodig, flexibel schema |
| Auth | JWT (Passport), rollen student/docent | NFR6 — token-gebaseerde authenticatie, rolgebaseerde autorisatie via een custom `RolesGuard` |
| API-contract | OpenAPI via `@nestjs/swagger`, beschikbaar op `/api/docs` | Front-end en back-end delen hetzelfde contract |
| Testing | Jest (unit tests, back-end) | Kernlogica (auth, matching/advies) afgedekt inclusief randgevallen |

Zie de presentatieslides voor de volledige onderbouwing (voor-/nadelen per laag, trade-offs, MCA).

## Lokaal opzetten

### Vereisten
- Node.js 20+
- Docker Desktop (voor Postgres en MongoDB)

### 1. Databases opstarten (via Docker)
```bash
docker run --name vlom-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vrij_lezen_op_maat -p 5432:5432 -d postgres:16
docker run --name vlom-mongo -p 27017:27017 -d mongo:7
```
> MongoDB draait bewust op versie 7, niet `latest` (8.x) — nieuwere Docker Desktop-kernels zijn incompatibel met MongoDB 8+.

### 2. Back-end
```bash
cd back-end
cp .env.example .env   # vul DATABASE_URL, MONGODB_URI, JWT_SECRET in
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed            # vult de Mongo-catalogus met echte data (zie hieronder)
npm run start:dev
```
- API: `http://localhost:3001`
- OpenAPI-documentatie: `http://localhost:3001/api/docs`

### 3. Front-end
```bash
cd front-end
cp .env.example .env.local
npm install
npm run dev
```
- App: `http://localhost:3000`

## Databronnen (catalogus)

De catalogus is gevuld met de door school aangeleverde bronnen (`VrijLezenOpMaat_Leescatalogus_1_0.xlsx`, 183 titels) in plaats van verzonnen data. Enkele bewuste mapping-keuzes, omdat de brondata niet 1-op-1 op het datamodel aansloot:

- **Taalniveau**: overgenomen in de originele 2F/2F-3F/3F/3F+ schaal (Nederlandse onderwijs-referentieniveaus), in plaats van CEFR.
- **Genre** (interne veldnaam, feitelijk "vorm"): afgeleid van de kolom "Type materiaal" (Boek, Boek - thriller, Boek - roman, Dichtbundel, Blogpost, Online artikel, Krant, Tijdschrift).
- **Onderwerp**: afgeleid van de eerste bruikbare tag in "Themas_boek". Zo'n 67% van de titels had geen (bruikbare) thema-tag in de brondata; deze zijn als `algemeen` gecategoriseerd in plaats van zelf iets te verzinnen, om de integriteit van de bron te bewaren.
- **Lengte**: geen kolom aanwezig in de bron; afgeleid van het materiaaltype (artikel/blog/krant/tijdschrift → Kort, dichtbundel/thriller → Middel, boek/roman → Lang) — een bewuste, beargumenteerde aanname.

Het seed-script staat in `back-end/scripts/seed-catalogus.ts`, met de brondata in `back-end/scripts/catalogus-data.json`.

## Architectuur

Zie `.docs/architectuur.svg` (of `.png`) voor het volledige diagram. Kort samengevat:

```
Next.js (front-end)  --REST/JSON + JWT-->  NestJS (back-end)
                                              |-- Prisma -> PostgreSQL
                                              |     (User, ReadingProfile,
                                              |      ReadingListItem,
                                              |      StudentDocentKoppeling)
                                              '-- Mongoose -> MongoDB
                                                    (CatalogusItem)
```

Gelaagde/modulaire back-end-architectuur: `controller -> service -> repository (Prisma/Mongoose)`, per domein-module:
- `auth` — registratie, login, JWT-strategie, `JwtAuthGuard`, `RolesGuard`
- `profile` — leesprofiel (FR1/FR2, upsert-patroon)
- `catalogus` — gepagineerde, filterbare boekencatalogus (FR4)
- `advies` — score-gebaseerde matching tussen leesprofiel en catalogus (FR3)
- `leeslijst` — persoonlijke leeslijst, toevoegen/togglen (FR5)
- `koppeling` — student koppelt zichzelf aan een docent (FR6)
- `docent` — docent-inzage in gekoppelde studenten en hun leeslijsten, rolgebaseerd afgeschermd (FR6, NFR6)

`catalogusItemId` op `ReadingListItem` is een bewust ontwerp: een los ID-veld dat naar een document in de andere database (Mongo) wijst, zonder foreign-key-garantie — de integriteit daarvan wordt in de applicatielaag bewaakt, niet door de database. Zie `.docs/erd.svg` voor het volledige datamodel, inclusief deze cross-database-referentie.

Gedeelde front-end UI staat in `front-end/src/components` (bijv. `AddToLeeslijstButton`, hergebruikt op zowel `/catalogus` als `/advies`).

## Coding style guide

- TypeScript strict mode aan in beide projecten.
- ESLint + Prettier; consistente camelCase-naamgeving voor variabelen/functies, PascalCase voor classes/componenten.
- DTO's met `class-validator` (validatie) + `@nestjs/swagger`-decorators (documentatie) op elk request-object.
- Guards + `@Roles()`-decorator voor autorisatie; nooit een `userId` uit de request-body vertrouwen — altijd uit het JWT-token (`req.user`).

## Testen

```bash
cd back-end
npm test          # unit tests: auth (register/login, incl. randgevallen), advies (matching/motivatie, incl. randgeval "niks matcht")
```

```bash
cd front-end
npm run e2e        # end-to-end tests (Playwright): registratie + advies, leeslijst togglen, beveiligde route zonder login
```

## Status

Functioneel compleet: FR1 t/m FR6, backend en front-end, met authenticatie en rolgebaseerde autorisatie.

Afgerond: responsive/accessibility-pas (NFR4/NFR5, skeleton loading, focus-rings), end-to-end tests (Playwright), CI/CD-pipeline (GitHub Actions: lint + unit tests backend, lint + build frontend), en een OpenAPI-contract via Orval voor login/register.

Bewuste scope-keuzes (geen oversight): geen aparte repository-laag tussen service en ORM, het OpenAPI-contract is alleen leidend voor login/register (rest van de app gebruikt handgeschreven fetch-calls), geen client-side route guard op /docent (de server wijst het beschermde endpoint wel af), en geen testcoverage-rapportage of branch-protection quality gate in CI.
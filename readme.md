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

| Laag | Keuze |
|---|---|
| Front-end | Next.js (App Router) + React + TypeScript + Tailwind CSS |
| Back-end | NestJS + TypeScript |
| Relationele database | PostgreSQL via Prisma (leesprofiel, leeslijst, gebruikers, student-docent koppeling) |
| Document store | MongoDB (catalogus met wisselende metadata) |
| Auth | JWT (Passport) met rollen student/docent |
| API-contract | OpenAPI, gegenereerd via `@nestjs/swagger`, beschikbaar op `/api/docs` |
| Testing | Jest (unit, beide projecten) + Playwright (e2e front-end) |

Zie de presentatieslides voor de volledige onderbouwing (voor-/nadelen, trade-offs, MCA).

## Lokaal opzetten

### Vereisten
- Node.js 20+
- PostgreSQL (lokaal of via Docker)
- MongoDB (lokaal of via Docker)

### Back-end
```bash
cd back-end
cp .env.example .env   # vul DATABASE_URL, MONGODB_URI en JWT_SECRET in
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```
De API draait op `http://localhost:3001`, de OpenAPI-documentatie op `http://localhost:3001/api/docs`.

### Front-end
```bash
cd front-end
cp .env.example .env.local
npm install
npm run dev
```
De app draait op `http://localhost:3000`.

## Architectuur

Zie `.docs/architectuur.png` voor het volledige systeemarchitectuur-diagram. Kort samengevat:

```
Next.js (front-end)  --REST/JSON + JWT-->  NestJS (back-end)
                                              |-- Prisma -> PostgreSQL (relationele data)
                                              '-- Mongo-client -> MongoDB (catalogus)
```

Het back-end project is opgebouwd volgens een gelaagde/modulaire architectuur:
`controller -> service -> repository`, per domein-module (`auth`, `profile`,
`advies`, `catalogus`, `leeslijst`). Gedeelde UI-componenten in de front-end
staan in `front-end/src/components/ui`.

## Coding style guide

- TypeScript strict mode aan in beide projecten.
- ESLint + Prettier verplicht; lint draait mee in de CI-pipeline en blokkeert bij falen.
- Naamgeving: componenten en classes in PascalCase, functies/variabelen in camelCase.

## Testen

```bash
# back-end
cd back-end
npm run test        # unit tests
npm run test:e2e     # e2e tests

# front-end
cd front-end
npm run test         # unit/component tests
npm run e2e           # Playwright end-to-end tests
```

## Status

Dit is een scaffold: projectstructuur, configuratie en de belangrijkste
bestanden staan klaar. De functionele requirements (FR1–FR6) en niet-
functionele requirements (NFR1–NFR7) worden hierbovenop uitgewerkt.

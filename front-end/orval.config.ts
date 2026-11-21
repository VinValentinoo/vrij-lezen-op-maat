// Twee gegenereerde clients uit hetzelfde OpenAPI-contract, die dezelfde types
// (models) delen maar een eigen mutator hebben:
//
//  - client: voor Client Components. Leest het JWT uit document.cookie (orval-mutator.ts).
//  - server: voor Server Components. Leest het JWT via cookies() van next/headers
//            (orval-server-mutator.ts). Dat kan niet in een client-bundel.
//
// Genereren: back-end draaien (npm run start:dev), dan `npm run generate-client`.
const input = {
    target: 'http://localhost:3001/api/docs-json',
};

export default {
    client: {
        input,
        output: {
            mode: 'tags-split',
            target: 'src/lib/generated/client.ts',
            schemas: 'src/lib/generated/models',
            client: 'fetch',
            override: {
                mutator: {
                    path: 'src/lib/orval-mutator.ts',
                    name: 'customFetch',
                },
            },
        },
    },
    server: {
        input,
        output: {
            mode: 'tags-split',
            target: 'src/lib/generated-server/client.ts',
            schemas: 'src/lib/generated/models',
            client: 'fetch',
            override: {
                mutator: {
                    path: 'src/lib/orval-server-mutator.ts',
                    name: 'customServerFetch',
                },
            },
        },
    },
};

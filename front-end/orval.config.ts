export default {
    vrijLezenOpMaat: {
        input: {
            target: 'http://localhost:3001/api/docs-json',
        },
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
};
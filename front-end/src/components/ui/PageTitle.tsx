import { ReactNode } from 'react';

export function PageTitle({ children }: { children: ReactNode }) {
    return <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">{children}</h1>;
}

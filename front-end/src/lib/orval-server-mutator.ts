import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseBody, toApiError } from './api-error';

// Mutator voor de server-variant van de gegenereerde client. Alleen importeren in
// Server Components (next/headers bestaat niet in de browser).
//
// Caching:
//  - Aanroep met { next: { revalidate: n } } = publieke data: geen token, Next cachet n seconden.
//  - Alle andere aanroepen zijn per gebruiker: token meesturen en nooit cachen.
const API_URL =
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const customServerFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const isPubliekGecachet = options.next?.revalidate !== undefined;
    const token = isPubliekGecachet ? undefined : cookies().get('token')?.value;

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
        ...(isPubliekGecachet || options.cache ? {} : { cache: 'no-store' as const }),
    });

    // Token ontbreekt of is verlopen: naar /login (redirect() gooit intern, dus niet in try/catch).
    if (res.status === 401) redirect('/login');
    if (!res.ok) throw await toApiError(res);

    const data = await parseBody<unknown>(res);
    return { data, status: res.status, headers: res.headers } as T;
};

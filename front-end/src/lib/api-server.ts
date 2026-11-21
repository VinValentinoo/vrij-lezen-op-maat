import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseBody, toApiError } from './api-error';

// Alleen voor Server Components en route handlers. API_URL hoeft niet publiek te
// zijn omdat deze code op de Next.js-server draait.
const API_URL =
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type ServerFetchOptions = {
    // true: stuur het JWT uit de cookie mee (en nooit cachen: per-gebruiker data).
    auth?: boolean;
    // Voor publieke data: hoe lang Next het resultaat mag cachen (seconden).
    revalidate?: number;
};

export async function serverFetch<T>(
    path: string,
    { auth = false, revalidate = 60 }: ServerFetchOptions = {},
): Promise<T> {
    const headers: Record<string, string> = {};

    if (auth) {
        const token = cookies().get('token')?.value;
        if (!token) redirect('/login');
        headers.Authorization = `Bearer ${token}`;
    }

    // Publieke data gebruikt de Next.js fetch-cache (revalidate); data van een
    // ingelogde gebruiker wordt nooit gecachet.
    const res = await fetch(`${API_URL}${path}`, {
        headers,
        ...(auth ? { cache: 'no-store' as const } : { next: { revalidate } }),
    });

    if (res.status === 401 && auth) redirect('/login');
    if (!res.ok) throw await toApiError(res);

    return parseBody<T>(res);
}

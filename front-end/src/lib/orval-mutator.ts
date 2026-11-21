import { getToken } from './cookies';
import { parseBody } from './api-error';
import { throwIfNotOk } from './api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Mutator voor de door Orval gegenereerde client: voegt het JWT toe en gebruikt
// dezelfde foutafhandeling als apiFetch. Bij login/register (/auth/...) betekent
// een 401 "verkeerd wachtwoord" en geen verlopen sessie, dus daar geen redirect.
export const customFetch = async <T>(
    url: string,
    options: RequestInit,
): Promise<T> => {
    const token = getToken();

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    await throwIfNotOk(res, Boolean(token), !url.startsWith('/auth/'));

    const data = await parseBody<unknown>(res);
    return { data, status: res.status, headers: res.headers } as T;
}

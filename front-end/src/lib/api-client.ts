import { deleteToken, getToken } from './cookies';
import { parseBody, toApiError } from './api-error';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Centrale afhandeling van mislukte responses voor ALLE client-side API-calls
// (zowel apiFetch als de gegenereerde Orval-client via orval-mutator).
//
// 401 met een token  -> token is verlopen of ongeldig: opruimen en naar /login.
// 401 zonder token   -> gebruiker is niet ingelogd: duidelijke melding.
export async function throwIfNotOk(
    res: Response,
    hadToken: boolean,
    handleUnauthorized = true,
): Promise<void> {
    if (res.ok) return;

    const error = await toApiError(res);

    if (res.status === 401 && handleUnauthorized && typeof window !== 'undefined') {
        if (hadToken) {
            deleteToken();
            error.message = 'Je sessie is verlopen. Log opnieuw in.';

            const opAuthPagina = ['/login', '/register'].includes(window.location.pathname);
            if (!opAuthPagina) {
                window.location.assign('/login');
            }
        } else {
            error.message = 'Log eerst in om dit te doen.';
        }
    }

    throw error;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init?.headers ?? {}),
        },
    });

    await throwIfNotOk(res, Boolean(token));

    return parseBody<T>(res);
}

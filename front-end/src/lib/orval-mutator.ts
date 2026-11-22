import { deleteToken, getToken } from './cookies';
import { parseBody, toApiError } from './api-error';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Mutator voor de door Orval gegenereerde client voor Client Components
// (de server-variant staat in orval-server-mutator.ts).
//
// Hier zit de centrale afhandeling van mislukte responses:
//  - 401 met token  -> token is verlopen of ongeldig: opruimen en naar /login.
//  - 401 zonder token -> niet ingelogd: duidelijke melding.
//  - /auth/...-calls (login, register, me) slaan dit over: een 401 betekent daar
//    "verkeerd wachtwoord" of "geen geldige sessie", en de aanroeper beslist zelf.
export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
    const token = getToken();

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    if (!res.ok) {
        const error = await toApiError(res);

        if (res.status === 401 && !url.startsWith('/auth/') && typeof window !== 'undefined') {
            if (token) {
                deleteToken();
                error.message = 'Je sessie is verlopen. Log opnieuw in.';
                window.location.assign('/login');
            } else {
                error.message = 'Log eerst in om dit te doen.';
            }
        }

        throw error;
    }

    const data = await parseBody<unknown>(res);
    return { data, status: res.status, headers: res.headers } as T;
};

import { getToken } from './cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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

    if (!res.ok) {
        let message = `API-fout (${res.status}): ${res.statusText}`;
        try {
            const errorBody = await res.json();
            if (errorBody.message) message = errorBody.message;
        } catch {
           
        }
        throw new Error(message);
    }

    const data = (await res.json()) as T;
    return { data, status: res.status, headers: res.headers} as T;
}
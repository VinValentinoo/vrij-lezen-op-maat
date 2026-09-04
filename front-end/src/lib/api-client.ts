import { getToken } from "./cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` }: {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `API-fout (${res.status}): ${res.statusText}`;

    try {
      const errorBody = await res.json()
      if(errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // valt terug op de standaard error message
    }

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

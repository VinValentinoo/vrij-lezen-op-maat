// Placeholder voor de gegenereerde/handgeschreven API-client.
// Doel: front-end praat uitsluitend via deze laag met de back-end, op basis
// van de OpenAPI-spec (zie back-end/api/docs), zodat FE en BE niet uit de
// pas kunnen lopen.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API-fout (${res.status}): ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

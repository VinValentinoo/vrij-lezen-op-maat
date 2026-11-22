// Waarom geen Cookie Store API?
// De Cookie Store API wordt nog niet door Safari en Firefox ondersteund (alleen Chromium).
//
// Bewuste afwijking (zie .docs/AFWIJKINGEN.md): het token staat in een gewone
// cookie die JavaScript kan lezen. Daardoor kan zowel de client (orval-mutator) als de
// Next.js-server (middleware, server components via cookies()) het token gebruiken.
// Een HttpOnly-cookie zou veiliger zijn tegen XSS, maar vraagt een BFF/route handler.

export function setToken(token: string) {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

export function getToken() {
    const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith('token='))
        ?.split("=")[1];

    if (!cookieToken) {
        return null;
    }

    return cookieToken;
}

export function deleteToken() {
    document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
}

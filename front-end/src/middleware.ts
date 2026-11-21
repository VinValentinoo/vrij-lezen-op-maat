import { NextResponse, type NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

// Route guard met Next.js Middleware: draait op de server VOORDAT een pagina
// gerenderd wordt. Zo zie je bij directe URL-invoer nooit even een pagina die je
// niet mag zien (de oude oplossing was een useEffect + router.push per pagina).
//
// Let op: dit is een optimistische check. We decoderen het JWT alleen (jose kan de
// handtekening niet controleren zonder het geheim van de back-end). De echte
// beveiliging blijft de JwtAuthGuard + RolesGuard in NestJS.

const VEREISTE_ROL: Record<string, 'STUDENT' | 'DOCENT'> = {
    '/docent': 'DOCENT',
    '/koppelen': 'STUDENT',
};

function redirectNaar(request: NextRequest, pad: string, verwijderToken = false) {
    const url = request.nextUrl.clone();
    url.pathname = pad;
    url.search = '';

    const response = NextResponse.redirect(url);
    if (verwijderToken) response.cookies.delete('token');
    return response;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) return redirectNaar(request, '/login');

    let payload;
    try {
        payload = decodeJwt(token);
    } catch {
        return redirectNaar(request, '/login', true);
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
        return redirectNaar(request, '/login', true);
    }

    // '/docent/abc' -> '/docent'
    const basis = `/${request.nextUrl.pathname.split('/')[1]}`;
    const vereisteRol = VEREISTE_ROL[basis];
    if (vereisteRol && payload.role !== vereisteRol) {
        return redirectNaar(request, '/');
    }

    return NextResponse.next();
}

// Alleen op de afgeschermde routes draaien (login, register, catalogus en de
// statische bestanden blijven vrij).
export const config = {
    matcher: [
        '/profiel/:path*',
        '/advies/:path*',
        '/leeslijst/:path*',
        '/koppelen/:path*',
        '/docent/:path*',
    ],
};

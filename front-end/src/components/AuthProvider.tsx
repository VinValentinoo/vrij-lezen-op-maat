'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { unwrap } from '@/lib/api-result';
import { ApiError } from '@/lib/api-error';
import { deleteToken, getToken, setToken } from '@/lib/cookies';
import { authControllerMe } from '@/lib/generated';
import type { CurrentUserDto } from '@/lib/generated/models';

type AuthContextValue = {
    user: CurrentUserDto | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// De ingelogde gebruiker staat op één plek: een React Context in de root layout.
// Eerder had elke component die de gebruiker nodig had een eigen /auth/me-call
// en synchroniseerden ze via een zelfgemaakt 'auth-changed' window-event.
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<CurrentUserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const loadUser = useCallback(async () => {
        if (!getToken()) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            setUser(unwrap(await authControllerMe()));
        } catch (error) {
            // Token is ongeldig of verlopen: opruimen, de gebruiker is dan niet ingelogd.
            if (error instanceof ApiError && error.status === 401) deleteToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // De middleware verwijdert een verlopen token en stuurt door naar /login.
    // Dan blijft deze (niet opnieuw gemounte) provider anders een oude user tonen.
    useEffect(() => {
        if (user && !getToken()) setUser(null);
    }, [pathname, user]);

    const login = useCallback(
        async (token: string) => {
            setToken(token);
            await loadUser();
        },
        [loadUser],
    );

    const logout = useCallback(() => {
        deleteToken();
        setUser(null);
    }, []);

    // useMemo: consumers (Navbar e.d.) renderen alleen opnieuw als de waarde echt verandert.
    const value = useMemo(
        () => ({ user, loading, login, logout }),
        [user, loading, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth moet binnen <AuthProvider> gebruikt worden.');
    }
    return context;
}

import { useEffect, useState } from "react"
import { apiFetch } from "./api-client";

type CurrentUser = { userId: string, role: 'STUDENT' | 'DOCENT' }

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await apiFetch<CurrentUser>('/auth/me');
                setUser(data);
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        load();
    }, []);

    return { user, loading };
}
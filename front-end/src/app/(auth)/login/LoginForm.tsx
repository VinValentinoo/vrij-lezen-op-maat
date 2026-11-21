'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { getErrorMessage } from '@/lib/api-error';
import { authControllerLogin } from '@/lib/generated';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();
    const { login } = useAuth();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        try {
            const { data } = await authControllerLogin({ email, password });
            await login(data.accessToken);
            router.push('/profiel');
        } catch (error) {
            setErr(getErrorMessage(error));
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                id="email"
                label="E-mailadres"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                id="password"
                label="Wachtwoord"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {err && <Alert>{err}</Alert>}
            <Button type="submit">Inloggen</Button>
        </form>
    );
}

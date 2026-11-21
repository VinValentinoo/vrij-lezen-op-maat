'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { getErrorMessage } from '@/lib/api-error';
import { authControllerRegister } from '@/lib/generated';
import { RegisterDtoRole } from '@/lib/generated/models';

const ROL_OPTIES = [
    { value: RegisterDtoRole.STUDENT, label: 'Student' },
    { value: RegisterDtoRole.DOCENT, label: 'Docent' },
];

export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<RegisterDtoRole>(RegisterDtoRole.STUDENT);
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErr(null);

        try {
            await authControllerRegister({ email, password, name, role });
            router.push('/login');
        } catch (error) {
            setErr(getErrorMessage(error));
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                id="name"
                label="Naam"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <SelectField
                id="role"
                name="role"
                label="Rol"
                options={ROL_OPTIES}
                value={role}
                onChange={(e) => setRole(e.target.value as RegisterDtoRole)}
            />
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
            <Button type="submit">Registreren</Button>
        </form>
    );
}

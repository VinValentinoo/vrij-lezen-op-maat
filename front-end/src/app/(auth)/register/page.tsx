import type { Metadata } from 'next';
import { PageTitle } from '@/components/ui/PageTitle';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = { title: 'Registreren' };

export default function RegisterPage() {
    return (
        <>
            <PageTitle>Registreren</PageTitle>
            <RegisterForm />
        </>
    );
}

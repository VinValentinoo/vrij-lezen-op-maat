import type { Metadata } from 'next';
import { PageTitle } from '@/components/ui/PageTitle';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Inloggen' };

export default function LoginPage() {
    return (
        <>
            <PageTitle>Inloggen</PageTitle>
            <LoginForm />
        </>
    );
}

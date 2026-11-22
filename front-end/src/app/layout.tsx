import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
    // template: elke pagina die alleen `title: 'Catalogus'` exporteert krijgt
    // automatisch "Catalogus | Vrij lezen op maat" als tabtitel.
    title: {
        default: 'Vrij lezen op maat',
        template: '%s | Vrij lezen op maat',
    },
    description: 'Persoonlijk leesadvies op basis van je leesprofiel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="nl">
            <body className="min-h-screen bg-background text-ink">
                <AuthProvider>
                    <Navbar />
                    <main className="mx-auto max-w-5xl px-4 py-8">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}

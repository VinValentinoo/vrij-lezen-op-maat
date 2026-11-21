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
                {/* Skip-link: toetsenbordgebruikers kunnen de navigatie overslaan (WCAG 2.4.1). */}
                <a
                    href="#hoofdinhoud"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-brand focus:shadow-md"
                >
                    Naar hoofdinhoud
                </a>
                <AuthProvider>
                    <Navbar />
                    <main id="hoofdinhoud" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 focus:outline-none">
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}

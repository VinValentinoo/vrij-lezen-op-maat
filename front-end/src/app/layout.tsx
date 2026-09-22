import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Vrij lezen op maat',
    description: 'Persoonlijk leesadvies op basis van je leesprofiel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="nl">
            <body className="min-h-screen bg-background text-ink">
                <Navbar />
                <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
            </body>
        </html>
    );
}
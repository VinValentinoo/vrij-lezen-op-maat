import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vrij lezen op maat',
  description: 'Persoonlijk leesadvies op basis van je leesprofiel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-white text-gray-900">
        <nav aria-label="Hoofdnavigatie" className="border-b p-4 flex gap-4">
          <a href="/profiel">Leesprofiel</a>
          <a href="/catalogus">Catalogus</a>
          <a href="/leeslijst">Leeslijst</a>
          <a href="/docent">Docent</a>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}

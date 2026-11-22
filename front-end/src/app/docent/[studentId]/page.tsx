import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookCard, BookGrid } from '@/components/BookCard';
import { BoekToevoegen } from '@/components/docent/BoekToevoegen';
import { PageTitle } from '@/components/ui/PageTitle';
import { unwrap } from '@/lib/api-result';
import {
    catalogusControllerFindAll,
    docentControllerGetGekoppeldeStudenten,
    docentControllerGetStudentenLijst,
} from '@/lib/generated-server';

export const metadata: Metadata = { title: 'Leeslijst van student' };

// Dynamische route: [studentId] komt als params.studentId binnen.
export default async function StudentLeeslijstPage({ params }: { params: { studentId: string } }) {
    const [studentenRes, catalogusRes] = await Promise.all([
        docentControllerGetGekoppeldeStudenten(),
        // Publieke data: Next cachet dit 60 seconden (zie orval-server-mutator.ts).
        catalogusControllerFindAll({ pageSize: 500 }, { next: { revalidate: 60 } }),
    ]);
    const studenten = unwrap(studentenRes);
    const catalogus = unwrap(catalogusRes);

    // Alleen aan jou gekoppelde studenten: een willekeurig of verzonnen id geeft de
    // 404-pagina (notFound) en nooit andermans gegevens.
    const student = studenten.find((s) => s.user.id === params.studentId);
    if (!student) notFound();

    const leeslijst = unwrap(await docentControllerGetStudentenLijst(student.user.id));

    const boeken = catalogus.items.map((item) => ({ id: item._id, titel: item.titel }));

    return (
        <div>
            <Link href="/docent" className="mb-4 inline-block text-sm text-brand hover:underline">
                ← Terug naar overzicht
            </Link>

            <PageTitle>Leeslijst van {student.user.naam}</PageTitle>

            {leeslijst.length === 0 ? (
                <p className="text-sm text-muted">Deze student heeft nog niets op de leeslijst staan.</p>
            ) : (
                <BookGrid>
                    {leeslijst.map((item) => (
                        <BookCard
                            key={item.id}
                            titel={item.titel ?? 'Onbekende titel'}
                            beschrijving={item.beschrijving ?? ''}
                            status={item.status}
                        />
                    ))}
                </BookGrid>
            )}

            <BoekToevoegen studentId={student.user.id} boeken={boeken} />
        </div>
    );
}

import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageTitle } from '@/components/ui/PageTitle';
import { unwrap } from '@/lib/api-result';
import { docentControllerGetGekoppeldeStudenten } from '@/lib/generated-server';

export const metadata: Metadata = { title: 'Docentoverzicht' };

// De rolcheck zit niet meer in deze pagina: src/middleware.ts stuurt niet-docenten
// weg voordat de pagina rendert, en de back-end (RolesGuard) blijft de echte slot.
export default async function DocentPage() {
    const studenten = unwrap(await docentControllerGetGekoppeldeStudenten());

    return (
        <div>
            <PageTitle>Docentoverzicht</PageTitle>

            {studenten.length === 0 ? (
                <p className="text-sm text-muted">Er zijn nog geen studenten aan jou gekoppeld.</p>
            ) : (
                <ul className="space-y-3">
                    {studenten.map((student) => (
                        <li
                            key={student.id}
                            className="flex items-center justify-between rounded-lg border border-brand-soft bg-white p-4 shadow-sm"
                        >
                            <div>
                                <p className="font-medium text-ink">{student.user.naam}</p>
                                <p className="text-sm text-muted">{student.user.email}</p>
                            </div>
                            {/* Dynamische route: /docent/[studentId] */}
                            <ButtonLink href={`/docent/${student.user.id}`} variant="secondary">
                                Bekijk leeslijst
                            </ButtonLink>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

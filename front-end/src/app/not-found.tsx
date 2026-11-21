import { ButtonLink } from '@/components/ui/ButtonLink';
import { PageTitle } from '@/components/ui/PageTitle';

// Wordt getoond bij een onbekende URL én bij notFound() (bv. /docent/[studentId]
// van een student die niet aan jou gekoppeld is).
export default function NotFound() {
    return (
        <div>
            <PageTitle>Pagina niet gevonden</PageTitle>
            <p className="mb-4 text-sm text-muted">
                Deze pagina bestaat niet, of je hebt er geen toegang toe.
            </p>
            <ButtonLink href="/">Terug naar home</ButtonLink>
        </div>
    );
}

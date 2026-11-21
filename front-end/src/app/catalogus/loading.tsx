import { Skeleton } from '@/components/Skeleton';
import { PageTitle } from '@/components/ui/PageTitle';

// Specifiek voor /catalogus: de titel staat er direct, de lijst volgt als skeleton.
export default function CatalogusLoading() {
    return (
        <div>
            <PageTitle>Catalogus</PageTitle>
            <Skeleton lines={4} />
        </div>
    );
}

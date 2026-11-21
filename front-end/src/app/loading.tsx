import { Skeleton } from '@/components/Skeleton';

// Next.js toont dit automatisch (via React Suspense) terwijl een server component
// zijn data ophaalt. Vervangt de handmatige `if (loading) return <Skeleton />`
// uit elke pagina.
export default function Loading() {
    return <Skeleton lines={4} />;
}

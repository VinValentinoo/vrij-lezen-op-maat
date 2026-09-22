type SkeletonProps = {
    lines?: number;
};

export function Skeleton({ lines = 3 }: SkeletonProps) {
    return (
        <div className="animate-pulse space-y-3" role="status" aria-label="Bezig met laden">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-brand-soft" style={{ width: `${100 - i * 15}%` }} />
            ))}
        </div>
    );
}
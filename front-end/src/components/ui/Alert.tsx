import { ReactNode } from 'react';

type AlertProps = {
    variant?: 'error' | 'success';
    className?: string;
    children: ReactNode;
};

// Eén component voor alle meldingen (stond ~10x als losse <p role="alert">).
// error  -> role="alert"  (schermlezer leest direct voor)
// success -> role="status" (beleefde aankondiging)
export function Alert({ variant = 'error', className = '', children }: AlertProps) {
    const isError = variant === 'error';

    return (
        <div
            role={isError ? 'alert' : 'status'}
            className={`mb-4 rounded-md px-3 py-2 text-sm ${
                isError ? 'bg-red-50 text-red-700' : 'bg-success-soft text-success-dark'
            } ${className}`}
        >
            {children}
        </div>
    );
}

import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

// Losse functie zodat ook <Link> (ButtonLink) dezelfde stijl kan gebruiken.
export function buttonStyles(variant: ButtonVariant = 'primary') {
    const base =
        'inline-block rounded-md px-4 py-2 text-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const styles =
        variant === 'primary'
            ? 'bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand'
            : 'bg-brand-soft text-brand hover:bg-brand-soft/70 focus-visible:ring-brand';

    return `${base} ${styles}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    return <button className={`${buttonStyles(variant)} ${className}`} {...props} />;
}

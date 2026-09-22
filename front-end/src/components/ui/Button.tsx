import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const base =
        'rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const styles =
        variant === 'primary'
            ? 'bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand'
            : 'bg-brand-soft text-brand hover:bg-brand-soft/70 focus-visible:ring-brand';

    return <button className={`${base} ${styles} ${className}`} {...props} />;
}
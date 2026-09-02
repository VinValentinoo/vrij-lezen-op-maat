import { ButtonHTMLAttributes } from 'react';

// Voorbeeld van herbruikbare UI (NFR1): één plek voor knop-styling,
// zodat deze niet gedupliceerd wordt over de app.
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'rounded px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400';

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

import Link from 'next/link';
import { ComponentProps } from 'react';
import { buttonStyles, ButtonVariant } from './Button';

type ButtonLinkProps = ComponentProps<typeof Link> & {
    variant?: ButtonVariant;
};

// Een echte link (<a>, werkt zonder JavaScript en met "open in nieuw tabblad")
// die eruitziet als een knop. Gebruikt voor navigatie, <Button> voor acties.
export function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonLinkProps) {
    return <Link className={`${buttonStyles(variant)} ${className}`} {...props} />;
}

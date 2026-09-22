'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
    { href: '/profiel', label: 'Leesprofiel' },
    { href: '/catalogus', label: 'Catalogus' },
    { href: '/advies', label: 'Advies' },
    { href: '/leeslijst', label: 'Leeslijst' },
    { href: '/docent', label: 'Docent' },
];

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="border-b border-brand-soft bg-white" aria-label="Hoofdnavigatie">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <Link href="/" className="font-serif text-lg font-semibold text-brand">
                    Vrij lezen op maat
                </Link>

                {/* Desktop */}
                <ul className="hidden gap-6 md:flex">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                aria-current={pathname === link.href ? 'page' : undefined}
                                className={`text-sm font-medium transition-colors hover:text-brand ${pathname === link.href ? 'text-brand underline underline-offset-4' : 'text-muted'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile toggle */}
                <button
                    className="md:hidden rounded-md p-2 text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    aria-expanded={open}
                    aria-controls="mobiel-menu"
                    aria-label={open ? 'Menu sluiten' : 'Menu openen'}
                    onClick={() => setOpen(!open)}
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <ul id="mobiel-menu" className="flex flex-col gap-1 border-t border-brand-soft px-4 py-3 md:hidden">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                aria-current={pathname === link.href ? 'page' : undefined}
                                onClick={() => setOpen(false)}
                                className={`block rounded-md px-3 py-2 text-sm font-medium ${pathname === link.href ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-brand-soft/50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
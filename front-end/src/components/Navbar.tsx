'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCurrentUser } from '@/lib/useCurrentUser';
import { deleteToken } from '@/lib/cookies';

const baseLinks = [
  { href: '/profiel', label: 'Leesprofiel' },
  { href: '/catalogus', label: 'Catalogus' },
  { href: '/advies', label: 'Advies' },
  { href: '/leeslijst', label: 'Leeslijst' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const links = user?.role === 'DOCENT' ? [...baseLinks, { href: '/docent', label: 'Docent' }] : baseLinks;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    deleteToken();
    setProfileOpen(false);
    router.push('/login');
  }

  return (
    <nav className="border-b border-brand-soft bg-white" aria-label="Hoofdnavigatie">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-lg font-semibold text-brand">
          Vrij lezen op maat
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {!loading && user && (
            <ul className="flex gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`text-sm font-medium transition-colors hover:text-brand ${
                      pathname === link.href ? 'text-brand underline underline-offset-4' : 'text-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && (
            user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-expanded={profileOpen}
                  aria-controls="profiel-menu"
                  className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    {user.naam?.charAt(0).toUpperCase() ?? '?'}
                  </span>
                  <span className="text-left leading-tight">
                    <span className="block text-sm font-medium text-ink">{user.naam}</span>
                    <span className="block text-xs text-muted">
                      {user.role === 'DOCENT' ? 'Docent' : 'Student'}
                    </span>
                  </span>
                </button>

                {profileOpen && (
                  <div
                    id="profiel-menu"
                    className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-brand-soft bg-white py-1 shadow-md"
                  >
                    {user.role === 'STUDENT' && (
                      <Link
                        href="/koppelen"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-ink hover:bg-brand-soft"
                      >
                        Koppelen aan docent
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-brand-soft"
                    >
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-brand hover:underline">
                Inloggen
              </Link>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-md p-2 text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-expanded={mobileOpen}
          aria-controls="mobiel-menu"
          aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobiel-menu" className="border-t border-brand-soft px-4 py-3 md:hidden">
          {!loading && user && (
            <div className="mb-3 flex items-center gap-2 border-b border-brand-soft pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {user.naam?.charAt(0).toUpperCase() ?? '?'}
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-medium text-ink">{user.naam}</span>
                <span className="block text-xs text-muted">
                  {user.role === 'DOCENT' ? 'Docent' : 'Student'}
                </span>
              </span>
            </div>
          )}

          <ul className="flex flex-col gap-1">
            {!loading && user && links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === link.href ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-brand-soft/50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {!loading && user?.role === 'STUDENT' && (
              <li>
                <Link
                  href="/koppelen"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-brand-soft/50"
                >
                  Koppelen aan docent
                </Link>
              </li>
            )}

            {!loading && (
              user ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted hover:bg-brand-soft/50"
                  >
                    Uitloggen
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-brand hover:bg-brand-soft/50"
                  >
                    Inloggen
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
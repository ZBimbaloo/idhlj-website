'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import clsx from 'clsx';

export function Navbar() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'group', href: '/group' },
    { key: 'factory', href: '/factory' },
    { key: 'products', href: '/products' },
    { key: 'quality', href: '/quality' },
    { key: 'sales', href: '/sales' },
    { key: 'contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12Z" />
              <path d="M12 6v12" />
            </svg>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold text-neutral-900">
              {tCommon('brand')}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {tCommon('companyShort')}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={clsx(
                'text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'text-brand-600'
                  : 'text-neutral-700 hover:text-brand-600'
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="hidden btn-primary px-5 py-2 text-xs md:inline-flex"
          >
            {tCommon('getQuote')}
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <nav className="container-narrow flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'py-3 text-sm font-medium border-b border-neutral-100 last:border-0',
                  isActive(item.href)
                    ? 'text-brand-600'
                    : 'text-neutral-700'
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4"
            >
              {tCommon('getQuote')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
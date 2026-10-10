'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { Languages } from 'lucide-react';
import clsx from 'clsx';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === 'en' ? 'id' : 'en';
  const label = locale === 'en' ? 'EN' : 'ID';

  const switchLocale = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-brand-500 hover:text-brand-600',
        isPending && 'opacity-50'
      )}
      aria-label="Switch language"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{label}</span>
      <span className="text-neutral-400">/</span>
      <span className="text-neutral-400">{nextLocale.toUpperCase()}</span>
    </button>
  );
}
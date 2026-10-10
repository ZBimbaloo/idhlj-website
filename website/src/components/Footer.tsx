import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';

export async function Footer() {
  const t = await getTranslations('footer');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-narrow py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12Z" />
                  <path d="M12 6v12" />
                </svg>
              </span>
              <span className="font-display text-base font-bold">
                {tCommon('brand')}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-neutral-600">{t('tagline')}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
              {t('partOf')} <span className="text-brand-600">{tCommon('brandGroup')}</span>
            </p>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {t('company')}
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link className="text-neutral-700 hover:text-brand-600" href="/about">{tNav('about')}</Link></li>
              <li><Link className="text-neutral-700 hover:text-brand-600" href="/group">{tNav('group')}</Link></li>
              <li><Link className="text-neutral-700 hover:text-brand-600" href="/factory">{tNav('factory')}</Link></li>
              <li><Link className="text-neutral-700 hover:text-brand-600" href="/quality">{tNav('quality')}</Link></li>
              <li><Link className="text-neutral-700 hover:text-brand-600" href="/sales">{tNav('sales')}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {t('contact')}
            </h5>
            <ul className="space-y-2.5 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-brand-500" />
                <span className="leading-snug">
                  Jl. Kapt Pattimura No.92/356-A<br />
                  Medan Baru, Kota Medan<br />
                  Sumatera Utara, Indonesia
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-none text-brand-500" />
                <a href="mailto:sales@id.gdhlj.com" className="hover:text-brand-600">sales@id.gdhlj.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-brand-500" />
                <a href="tel:+62212513010" className="hover:text-brand-600">+62 21 251 3010</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {tCommon('companyName')}. {tCommon('allRights')}</p>
          <p className="text-neutral-500">
            {tCommon('brandGroup')} · Stock Code 300997.SZ
          </p>
        </div>
      </div>
    </footer>
  );
}
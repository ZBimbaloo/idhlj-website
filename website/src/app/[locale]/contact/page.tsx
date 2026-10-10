import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock, Building2, FileCheck2, Hash, CalendarDays } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('contact');
  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tCommon = await getTranslations('common');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const products = messages.products.items as Array<{ id: string; name: string }>;

  const formLabels = {
    name: t('form.name'),
    company: t('form.company'),
    email: t('form.email'),
    phone: t('form.phone'),
    country: t('form.country'),
    product: t('form.product'),
    message: t('form.message'),
    submit: t('form.submit'),
    sending: t('form.sending'),
    required: t('form.required'),
  };

  return (
    <div>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section">
        <div className="container-narrow grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {t('infoTitle')}
            </h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <MapPin className="mt-0.5 h-5 w-5 flex-none text-brand-500" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    {t('addressLabel')}
                  </p>
                  <p className="mt-1 text-sm font-medium">{t('legalCompanyName')}</p>
                  <p className="text-sm leading-snug text-neutral-600">
                    {t('addressLine')}
                    <br />
                    {locale === 'id' ? t('cityOfMedan') : 'Kota Medan, Sumatera Utara, Indonesia'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <Mail className="mt-0.5 h-5 w-5 flex-none text-brand-500" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    {tCommon('email')}
                  </p>
                  <a href="mailto:sales@id.gdhlj.com" className="mt-1 block text-sm font-medium hover:text-brand-600">
                    sales@id.gdhlj.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <Phone className="mt-0.5 h-5 w-5 flex-none text-brand-500" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    {tCommon('phone')} / WhatsApp
                  </p>
                  <a href="tel:+62212513010" className="mt-1 block text-sm font-medium hover:text-brand-600">
                    +62 21 251 3010
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                <Clock className="mt-0.5 h-5 w-5 flex-none text-brand-500" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    {tCommon('workingHours')}
                  </p>
                  <p className="mt-1 text-sm font-medium">{t('officeHours')}</p>
                </div>
              </li>
            </ul>

            <a
              href="https://wa.me/62212513010?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20coconut%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1DA851]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.65.074-.99.372-.34.297-1.297 1.268-1.297 3.092 0 1.825 1.328 3.586 1.514 3.834.186.248 2.612 3.99 6.328 5.594.884.382 1.573.61 2.112.78.886.24 1.692.207 2.55.124.78-.074 1.758-.717 2.006-1.41.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              {t('whatsappLabel')}
            </a>

            {/* Legal & Tax Identifiers */}
            <div className="mt-10 rounded-2xl border border-neutral-200 bg-sand-50/60 p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-neutral-900">
                <FileCheck2 className="h-4 w-4 text-brand-500" />
                {t('legalTitle')}
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 flex-none text-neutral-400" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500">
                      {t('legalCompanyLabel')}
                    </dt>
                    <dd className="font-medium text-neutral-800">{t('legalCompanyName')}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="mt-0.5 h-4 w-4 flex-none text-neutral-400" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500">
                      {t('legalNpwpLabel')}
                    </dt>
                    <dd className="font-mono text-sm text-neutral-800">{t('legalNpwp')}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="mt-0.5 h-4 w-4 flex-none text-neutral-400" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500">
                      {t('legalNibLabel')}
                    </dt>
                    <dd className="font-mono text-sm text-neutral-800">{t('legalNib')}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 flex-none text-neutral-400" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500">
                      {t('legalKppLabel')}
                    </dt>
                    <dd className="text-sm text-neutral-800">{t('legalKpp')}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 flex-none text-neutral-400" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500">
                      {t('legalFoundedLabel')}
                    </dt>
                    <dd className="text-sm text-neutral-800">{t('legalFounded')}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-semibold">{t('formTitle')}</h2>
            <div className="mt-6">
              <ContactForm labels={formLabels} products={products} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
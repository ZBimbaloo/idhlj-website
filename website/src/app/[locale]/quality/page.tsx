import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { Award, FileCheck } from 'lucide-react';
import { CertificateGallery } from '@/components/CertificateGallery';

export async function generateMetadata() {
  const t = await getTranslations('quality');
  return { title: t('title'), description: t('subtitle') };
}

export default async function QualityPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('quality');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const items = messages.quality.items as Array<{
    name: string;
    category: string;
    issuer: string;
    description: string;
    file?: string;
    status?: string;
  }>;
  const categoryLabels = messages.quality.categories as Record<string, string>;
  const availableCount = items.filter((it) => Boolean(it.file)).length;

  return (
    <div>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      <section className="section-sm">
        <div className="container-narrow max-w-4xl">
          <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold">{t('introTitle')}</h2>
                <p className="mt-3 text-base leading-relaxed text-neutral-600">{t('intro')}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <Award className="h-4 w-4" />
              {availableCount} / {items.length} {locale === 'id' ? 'sertifikat tersedia' : 'certificates on file'}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-narrow">
          <CertificateGallery
            items={items}
            categoryLabels={categoryLabels}
            labels={{
              viewDoc: t('viewDoc'),
              downloadDoc: t('downloadDoc'),
              availableOnRequest: t('availableOnRequest'),
            }}
          />
        </div>
      </section>
    </div>
  );
}
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { SmartImage } from '@/components/SmartImage';
import { Award, Building2, Leaf } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('about');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const timeline = messages.about.timeline as Array<{
    year: string;
    title: string;
    description: string;
  }>;

  return (
    <div>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Company at a glance */}
      <section className="section">
        <div className="container-narrow">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <SmartImage
              src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20coconut%20factory%20facility%20aerial%20view%20tropical%20green&image_size=landscape_4_3"
              alt="Company facility"
              aspectRatio="wide"
              className="rounded-3xl shadow-xl"
            />
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl text-balance">
                {t('companyIntroTitle')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-neutral-600">
                {t('companyIntroBody')}
              </p>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  { Icon: Building2, label: 'Indonesia' },
                  { Icon: Leaf, label: 'Coconut' },
                  { Icon: Award, label: 'Certified' },
                ].map((it, i) => (
                  <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
                    <it.Icon className="mx-auto h-5 w-5 text-brand-500" />
                    <p className="mt-2 text-xs font-medium text-neutral-700">{it.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group & Indonesia split */}
      <section className="section bg-white">
        <div className="container-narrow grid gap-10 md:grid-cols-2">
          <div className="card p-8">
            <span className="eyebrow">{t('groupTitle')}</span>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{t('groupBody')}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
              <Award className="h-4 w-4" /> 300997.SZ
            </div>
          </div>
          <div className="card p-8">
            <span className="eyebrow">{t('indonesiaTitle')}</span>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{t('indonesiaBody')}</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-sm bg-sand-50">
        <div className="container-narrow">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            {t('timelineTitle')}
          </h2>
          <div className="mx-auto mt-12 max-w-4xl">
            {timeline.map((it, i) => (
              <div
                key={i}
                className="relative grid gap-3 border-l-2 border-brand-200 pl-8 pb-10 last:pb-0 md:grid-cols-[120px_1fr] md:gap-8"
              >
                <span className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 ring-4 ring-sand-50" />
                <div className="font-display text-2xl font-semibold text-brand-600">{it.year}</div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{it.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
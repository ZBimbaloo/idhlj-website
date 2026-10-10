import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { SmartImage } from '@/components/SmartImage';
import { Globe2 } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('sales');
  return { title: t('title'), description: t('subtitle') };
}

const regionIcon: Record<string, string> = {
  'Southeast Asia': '🌏',
  'Asia Tenggara': '🌏',
  'Middle East & Africa': '🕌',
  'Timur Tengah & Afrika': '🕌',
  'Europe': '🏛️',
  'Eropa': '🏛️',
  'Americas': '🌎',
  'Greater China': '🇨🇳',
};

export default async function SalesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('sales');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const regions = messages.sales.regions as Array<{ name: string; description: string }>;
  const channels = messages.sales.channels as Array<{ title: string; description: string }>;

  return (
    <div>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      {/* Intro */}
      <section className="section-sm">
        <div className="container-narrow max-w-4xl">
          <p className="text-center text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* World map visual */}
      <section className="section-sm">
        <div className="container-narrow">
          <div className="image-frame relative overflow-hidden rounded-3xl shadow-xl">
            <SmartImage
              src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=world%20map%20abstract%20modern%20light%20minimal%20dots%20connections%20global%20trade&image_size=landscape_16_9"
              alt="World map"
              aspectRatio="wide"
              className="rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
            <div className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-700 shadow">
              <Globe2 className="h-4 w-4 text-brand-500" /> {regions.length}+ regions
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="section bg-white">
        <div className="container-narrow">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            {t('regionsTitle')}
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((r, i) => (
              <div key={i} className="card p-6">
                <div className="text-3xl">{regionIcon[r.name] || '🌐'}</div>
                <h3 className="mt-3 font-display text-lg font-semibold">{r.name}</h3>
                <p className="mt-2 text-sm text-neutral-600">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="section bg-sand-50">
        <div className="container-narrow">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            {t('channelTitle')}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {channels.map((c, i) => (
              <div key={i} className="card p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white font-bold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
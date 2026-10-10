import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { SmartImage } from '@/components/SmartImage';
import { MapPin, Building2, AlertCircle } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('factory');
  return { title: t('title'), description: t('subtitle') };
}

export default async function FactoryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('factory');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const stats = messages.factory.stats as Array<{ value: string; label: string }>;
  const process = messages.factory.process as Array<{
    step: string;
    title: string;
    description: string;
  }>;

  const galleryImages = [
    {
      prompt: 'aerial%20view%20coconut%20factory%20facility%20tropical',
      alt: 'Aerial view of factory',
    },
    {
      prompt: 'coconut%20raw%20material%20receiving%20warehouse%20workers',
      alt: 'Raw material reception',
    },
    {
      prompt: 'coconut%20production%20line%20stainless%20steel%20machinery',
      alt: 'Production line',
    },
    {
      prompt: 'quality%20control%20laboratory%20food%20testing%20scientists',
      alt: 'Quality lab',
    },
    {
      prompt: 'aseptic%20filling%20packaging%20line%20food%20manufacturing',
      alt: 'Aseptic filling',
    },
    {
      prompt: 'climate%20controlled%20warehouse%20pallets%20finished%20goods',
      alt: 'Warehouse',
    },
  ];

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

      {/* Location */}
      <section className="section-sm">
        <div className="container-narrow max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex items-start gap-3 p-5">
              <MapPin className="mt-0.5 h-5 w-5 flex-none text-brand-500" />
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  {t('locationTitle')}
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {t('locationLine')}
                </p>
              </div>
            </div>
            <div className="card flex items-start gap-3 p-5">
              <Building2 className="mt-0.5 h-5 w-5 flex-none text-neutral-500" />
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  {t('registeredOfficeTitle')}
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {t('registeredOfficeLine')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm">
        <div className="container-narrow">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {t('statsTitle')}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              <AlertCircle className="h-3.5 w-3.5" />
              {t('statsNote')}
            </span>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="font-display text-3xl font-semibold text-neutral-400">{s.value}</div>
                <div className="mt-2 text-sm text-neutral-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t('videoTitle')}</h2>
            <p className="mt-3 text-neutral-600">{t('videoSubtitle')}</p>
          </div>
          <div className="image-frame relative mx-auto mt-10 max-w-4xl aspect-video overflow-hidden rounded-3xl bg-black">
            <SmartImage
              src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coconut%20processing%20factory%20production%20line%20workers%20sterile%20modern%20machinery&image_size=landscape_16_9"
              alt="Factory video preview"
              aspectRatio="video"
              className="rounded-3xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
              <button className="group flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl transition-transform hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-8 w-8 fill-brand-500 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <p className="mt-4 text-sm font-medium text-white">{t('videoSubtitle')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-sand-50">
        <div className="container-narrow">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t('processTitle')}</h2>
            <p className="mt-3 max-w-2xl mx-auto text-neutral-600">{t('processSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {process.map((p) => (
              <div key={p.step} className="card p-6">
                <div className="font-display text-2xl font-semibold text-brand-600">{p.step}</div>
                <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section bg-white">
        <div className="container-narrow">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            {t('galleryTitle')}
          </h2>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, i) => (
              <SmartImage
                key={i}
                src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${img.prompt}&image_size=landscape_4_3`}
                alt={img.alt}
                aspectRatio="wide"
                className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
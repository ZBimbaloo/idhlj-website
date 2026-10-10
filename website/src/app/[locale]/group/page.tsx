import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { ExternalLink } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations('group');
  return { title: t('title'), description: t('subtitle') };
}

export default async function GroupPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('group');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const stats = messages.group.stats as Array<{ value: string; label: string }>;
  const subs = messages.group.subsidiaries as Array<{
    name: string;
    nameLocal: string;
    country: string;
    role: string;
    description: string;
    website: string;
  }>;

  const countryFlags: Record<string, string> = {
    China: '🇨🇳',
    Vietnam: '🇻🇳',
    Thailand: '🇹🇭',
    Indonesia: '🇮🇩',
  };

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

      {/* Stats */}
      <section className="section-sm bg-sand-50">
        <div className="container-narrow">
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">
            {t('statsTitle')}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="font-display text-3xl font-semibold text-brand-600">{s.value}</div>
                <div className="mt-2 text-sm text-neutral-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subsidiaries */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            {t('subsidiariesTitle')}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {subs.map((s, i) => (
              <div key={i} className="card p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{countryFlags[s.country] || '🌐'}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        {s.country}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold">{s.name}</h3>
                    {s.nameLocal && s.nameLocal !== s.name && (
                      <p className="mt-0.5 text-sm text-neutral-500">{s.nameLocal}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 whitespace-nowrap">
                    {s.role}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{s.description}</p>
                {s.website !== '#' && (
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Visit Website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
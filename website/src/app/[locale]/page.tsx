import { Link } from '@/i18n/routing';
import { ArrowRight, Award, ShieldCheck, Truck, Leaf, Sparkles } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionTitle } from '@/components/SectionTitle';
import { SmartImage } from '@/components/SmartImage';
import { HeroSlideshow, type HeroSlide } from '@/components/HeroSlideshow';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const productsCategories = messages.products.categories as Array<{
    key: string;
    name: string;
    image: string;
    description: string;
  }>;
  const whyItems = t.raw('whyItems') as Array<{ title: string; description: string }>;
  const heroSlideTexts = t.raw('heroSlides') as Array<{
    eyebrow: string;
    title: string;
    subtitle: string;
  }>;
  const whyIcons = [Truck, ShieldCheck, Sparkles];

  const heroSlideImages = [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coconut%20plantation%20aerial%20view%20tropical%20green%20Indonesia%20photography&image_size=landscape_16_9',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20coconut%20processing%20factory%20production%20line%20stainless%20steel%20machinery%20sterile&image_size=landscape_16_9',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coconut%20water%20milk%20oil%20products%20lineup%20studio%20photography%20packaged&image_size=landscape_16_9',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=corporate%20food%20group%20headquarters%20modern%20building%20skyline%20global%20business&image_size=landscape_16_9',
  ];

  const heroSlides: HeroSlide[] = heroSlideTexts.map((text, i) => ({
    image: heroSlideImages[i],
    alt: text.title,
    eyebrow: text.eyebrow,
    title: text.title,
    subtitle: text.subtitle,
  }));

  const heroBadges = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-white/70">
      <span className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-leaf-400" /> Halal</span>
      <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-brand-300" /> HACCP</span>
      <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> ISO 22000</span>
    </div>
  );

  return (
    <div>
      {/* HERO — full-module carousel */}
      <HeroSlideshow
        slides={heroSlides}
        ctaPrimary={{ label: t('heroCtaPrimary'), href: '/contact' }}
        ctaSecondary={{ label: t('heroCtaSecondary'), href: '/products' }}
        badges={heroBadges}
        intervalMs={6000}
      />

      {/* WHY */}
      <section className="section">
        <div className="container-narrow">
          <SectionTitle
            eyebrow={t('whyEyebrow')}
            title={t('whyTitle')}
            subtitle={t('whySubtitle')}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const Icon = whyIcons[i];
              const item = whyItems[i];
              return (
                <div key={i} className="card p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section bg-white">
        <div className="container-narrow">
          <SectionTitle
            eyebrow={t('productsEyebrow')}
            title={t('productsTitle')}
            subtitle={t('productsSubtitle')}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productsCategories.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?cat=${cat.key}`}
                className="group card overflow-hidden"
              >
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  aspectRatio="square"
                  className="rounded-t-2xl"
                />
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold group-hover:text-brand-600">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{cat.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                    {tCommon('viewMore')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products" className="btn-secondary">
              {tNav('products')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FACTORY VIDEO */}
      <section className="section-sm bg-sand-50">
        <div className="container-narrow">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="eyebrow">{t('factoryEyebrow')}</span>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl text-balance">
                {t('factoryTitle')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                {t('factorySubtitle')}
              </p>
              <Link href="/factory" className="btn-secondary mt-6">
                {tCommon('exploreFactory')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="image-frame aspect-video relative shadow-xl">
              <SmartImage
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coconut%20processing%20factory%20production%20line%20workers%20sterile%20environment&image_size=landscape_16_9"
                alt="Factory preview"
                aspectRatio="video"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-brand-500 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white bg-black/40 rounded px-3 py-1.5 backdrop-blur-sm">
                {t('factoryVideoCaption')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GROUP */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <SmartImage
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20corporate%20office%20headquarters%20building%20food%20group&image_size=landscape_16_9"
                alt="Group headquarters"
                aspectRatio="wide"
                className="rounded-3xl shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <span className="eyebrow">{t('groupEyebrow')}</span>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl text-balance">
                {t('groupTitle')}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                {t('groupSubtitle')}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
                <Award className="h-4 w-4" /> Huanlejia Group · 300997.SZ
              </div>
              <div className="mt-6">
                <Link href="/group" className="btn-secondary">
                  {t('groupCta')} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section-sm bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white">
        <div className="container-narrow text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
            {t('contactEyebrow')}
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl text-balance">
            {t('contactTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-50 sm:text-lg">
            {t('contactSubtitle')}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-700 hover:bg-sand-50"
          >
            {tCommon('contactUs')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
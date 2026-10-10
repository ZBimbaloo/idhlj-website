import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { ProductExplorer } from '@/components/ProductExplorer';

export async function generateMetadata() {
  const t = await getTranslations('products');
  return { title: t('title'), description: t('subtitle') };
}

export default async function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const tCommon = await getTranslations('common');
  const messages = (await import(`@/messages/${locale}.json`)).default;

  const categories = messages.products.categories as Array<{
    key: string;
    name: string;
    image: string;
    description: string;
  }>;
  const products = messages.products.items as Array<{
    id: string;
    category: string;
    name: string;
    image: string;
    summary: string;
    specs: Record<string, string>;
  }>;

  const labels = {
    categoriesTitle: t('categoriesTitle'),
    listTitle: t('listTitle'),
    specsTitle: t('specsTitle'),
    downloadTitle: t('downloadTitle'),
    downloadSubtitle: t('downloadSubtitle'),
    getQuote: tCommon('getQuote'),
    downloadPdf: tCommon('downloadPdf'),
    viewMore: tCommon('viewMore'),
    all: locale === 'id' ? 'Semua' : 'All',
  };

  return (
    <div>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <ProductExplorer
        categories={categories}
        products={products}
        labels={labels}
      />
    </div>
  );
}
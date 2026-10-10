'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { ArrowRight, Download, X as CloseIcon } from 'lucide-react';
import { SmartImage } from '@/components/SmartImage';
import clsx from 'clsx';

type Category = { key: string; name: string; image: string; description: string };
type Product = {
  id: string;
  category: string;
  name: string;
  image: string;
  summary: string;
  specs: Record<string, string>;
};

type Props = {
  categories: Category[];
  products: Product[];
  labels: {
    categoriesTitle: string;
    listTitle: string;
    specsTitle: string;
    downloadTitle: string;
    downloadSubtitle: string;
    getQuote: string;
    downloadPdf: string;
    viewMore: string;
    all: string;
  };
};

const specLabels: Record<string, { en: string; id: string }> = {
  netWeight: { en: 'Net Weight', id: 'Berat Bersih' },
  brix: { en: 'Brix', id: 'Brix' },
  fat: { en: 'Fat Content', id: 'Kadar Lemak' },
  moisture: { en: 'Moisture', id: 'Kadar Air' },
  shelfLife: { en: 'Shelf Life', id: 'Masa Simpan' },
  storage: { en: 'Storage', id: 'Penyimpanan' },
  certification: { en: 'Certification', id: 'Sertifikasi' },
};

export function ProductExplorer({ categories, products, labels }: Props) {
  const [activeCat, setActiveCat] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const locale = useLocale();

  const filtered = useMemo(() => {
    if (activeCat === 'all') return products;
    return products.filter((p) => p.category === activeCat);
  }, [activeCat, products]);

  return (
    <div>
      {/* Categories */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            {labels.categoriesTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCat(cat.key);
                  setSelectedProduct(null);
                  document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group text-left"
              >
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  aspectRatio="square"
                  className="rounded-2xl shadow-sm transition-shadow group-hover:shadow-lg"
                />
                <h3 className="mt-3 font-display text-base font-semibold group-hover:text-brand-600">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product list */}
      <section id="product-list" className="section bg-white">
        <div className="container-narrow">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{labels.listTitle}</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCat('all')}
                className={clsx(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCat === 'all'
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-500 hover:text-brand-600'
                )}
              >
                {labels.all}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCat(cat.key)}
                  className={clsx(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    activeCat === cat.key
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-500 hover:text-brand-600'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <SmartImage
                  src={p.image}
                  alt={p.name}
                  aspectRatio="square"
                  className="rounded-t-2xl"
                />
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold">{p.name}</h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{p.summary}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="btn-secondary flex-1 px-4 py-2 text-xs"
                    >
                      {labels.viewMore}
                    </button>
                    <Link
                      href="/contact"
                      className="btn-primary flex-1 px-4 py-2 text-xs"
                    >
                      {labels.getQuote}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section className="section-sm bg-sand-50">
        <div className="container-narrow">
          <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold">{labels.downloadTitle}</h3>
              <p className="mt-1 text-sm text-neutral-600">{labels.downloadSubtitle}</p>
            </div>
            <button className="btn-primary">
              <Download className="h-4 w-4" /> {labels.downloadPdf}
            </button>
          </div>
        </div>
      </section>

      {/* Product detail modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white"
              aria-label="Close"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <SmartImage
              src={selectedProduct.image}
              alt={selectedProduct.name}
              aspectRatio="wide"
              className="rounded-t-2xl"
            />
            <div className="p-8">
              <h3 className="font-display text-2xl font-semibold">{selectedProduct.name}</h3>
              <p className="mt-2 text-neutral-600">{selectedProduct.summary}</p>
              <h4 className="mt-6 font-display text-base font-semibold">{labels.specsTitle}</h4>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(selectedProduct.specs).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-neutral-200 bg-sand-50 p-3">
                    <dt className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {specLabels[key]?.[locale as 'en' | 'id'] || key}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-800">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  {labels.getQuote} <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="btn-secondary">
                  <Download className="h-4 w-4" /> {labels.downloadPdf}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
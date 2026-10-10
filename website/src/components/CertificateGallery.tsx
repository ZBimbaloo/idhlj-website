'use client';

import { useState } from 'react';
import { FileText, ExternalLink, Download, Lock, X, Maximize2 } from 'lucide-react';
import clsx from 'clsx';

type CertItem = {
  name: string;
  category: string;
  issuer: string;
  description: string;
  file?: string;
  status?: string;
};

type Props = {
  items: CertItem[];
  categoryLabels: Record<string, string>;
  labels: {
    viewDoc: string;
    downloadDoc: string;
    availableOnRequest: string;
  };
};

const categoryIcon: Record<string, string> = {
  food: '🛡️',
  business: '📋',
  environment: '🌿',
  labour: '👥',
};

const categoryColor: Record<string, string> = {
  food: 'from-brand-50 to-brand-100/40 ring-brand-200',
  business: 'from-amber-50 to-amber-100/40 ring-amber-200',
  environment: 'from-leaf-50 to-leaf-100/40 ring-leaf-200',
  labour: 'from-blue-50 to-blue-100/40 ring-blue-200',
};

export function CertificateGallery({ items, categoryLabels, labels }: Props) {
  const [active, setActive] = useState<CertItem | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const isAvailable = Boolean(it.file);
          const colorClass = categoryColor[it.category] || 'from-neutral-50 to-neutral-100/40 ring-neutral-200';
          return (
            <div
              key={i}
              className={clsx(
                'group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
              )}
            >
              {/* Thumbnail */}
              <button
                type="button"
                onClick={() => isAvailable && setActive(it)}
                disabled={!isAvailable}
                className={clsx(
                  'relative block aspect-[4/3] w-full overflow-hidden bg-gradient-to-br p-6 ring-1 ring-inset',
                  colorClass,
                  isAvailable ? '' : 'cursor-not-allowed opacity-90'
                )}
                aria-label={
                  isAvailable ? `Open ${it.name} document` : `${it.name} — available on request`
                }
              >
                {/* Decorative watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[120px] leading-none">
                    {categoryIcon[it.category] || '📄'}
                  </span>
                </div>

                {/* Corner badge */}
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-700 backdrop-blur-sm ring-1 ring-neutral-200">
                  {categoryLabels[it.category] || it.category}
                </div>

                {/* Center content */}
                <div className="relative flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
                    {isAvailable ? (
                      <FileText className="h-7 w-7 text-brand-500" />
                    ) : (
                      <Lock className="h-6 w-6 text-neutral-400" />
                    )}
                  </div>
                  <p className="line-clamp-2 px-2 font-display text-sm font-semibold text-neutral-900">
                    {it.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    {it.issuer}
                  </p>
                </div>

                {/* Hover overlay */}
                {isAvailable && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-900">
                      <Maximize2 className="h-3.5 w-3.5" />
                      {labels.viewDoc}
                    </span>
                  </div>
                )}

                {!isAvailable && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-2 text-center text-[11px] font-medium text-white backdrop-blur-sm">
                    {labels.availableOnRequest}
                  </div>
                )}
              </button>

              {/* Body */}
              <div className="p-5">
                <p className="text-sm leading-relaxed text-neutral-600">
                  {it.description}
                </p>
                {isAvailable && (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActive(it)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {labels.viewDoc}
                    </button>
                    <a
                      href={it.file}
                      download
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-brand-500 hover:text-brand-600"
                      aria-label={`${labels.downloadDoc} ${it.name}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF modal */}
      {active && active.file && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
        >
          <div
            className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-sand-50 px-6 py-4">
              <div>
                <h3
                  id="cert-modal-title"
                  className="font-display text-lg font-semibold text-neutral-900"
                >
                  {active.name}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {active.issuer} · {categoryLabels[active.category] || active.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={active.file}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  <Download className="h-3.5 w-3.5" />
                  {labels.downloadDoc}
                </a>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-neutral-200 hover:bg-neutral-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-neutral-100">
              <iframe
                src={active.file}
                title={active.name}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
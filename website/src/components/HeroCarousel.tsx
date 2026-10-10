'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export type HeroSlide = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  slides: HeroSlide[];
  intervalMs?: number;
};

export function HeroCarousel({ slides, intervalMs = 5000 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [paused, next, intervalMs]);

  return (
    <div
      className="relative h-[520px] overflow-hidden rounded-3xl shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={clsx(
            'absolute inset-0 transition-opacity duration-[1200ms] ease-in-out',
            i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
          aria-hidden={i !== active}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            className="h-full w-full object-cover"
            draggable={false}
          />
          {s.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-6 py-5">
              <p className="text-sm font-medium text-white sm:text-base">{s.caption}</p>
            </div>
          )}
        </div>
      ))}

      {/* Prev / Next */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-md backdrop-blur transition-colors hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={next}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-md backdrop-blur transition-colors hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={clsx(
              'h-1.5 rounded-full transition-all',
              i === active
                ? 'w-8 bg-white'
                : 'w-2 bg-white/60 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </div>
  );
}
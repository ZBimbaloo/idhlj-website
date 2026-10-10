'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type KeyboardEvent,
  type TouchEvent,
} from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import clsx from 'clsx';

export type HeroSlide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type Props = {
  slides: HeroSlide[];
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  badges?: ReactNode;
  intervalMs?: number;
};

const SWIPE_THRESHOLD = 50; // px

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function HeroSlideshow({
  slides,
  ctaPrimary,
  ctaSecondary,
  badges,
  intervalMs = 6000,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [progressKey, setProgressKey] = useState(0); // force progress bar replay
  const preloadedRef = useRef<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const next = useCallback(
    () => setActive((i) => (i + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i - 1 + slides.length) % slides.length),
    [slides.length]
  );
  const goTo = useCallback((i: number) => setActive(i), []);

  // Background-preload upcoming slide via Image() so it's cached before rotation
  useEffect(() => {
    const upcoming = slides[(active + 1) % slides.length];
    if (!upcoming || preloadedRef.current.has(upcoming.image)) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = upcoming.image;
    preloadedRef.current.add(upcoming.image);
  }, [active, slides]);

  // Auto rotation
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [paused, next, intervalMs]);

  // Reset progress animation when slide changes
  useEffect(() => {
    setProgressKey((k) => k + 1);
  }, [active]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    },
    [prev, next]
  );

  // Touch swipe navigation
  const handleTouchStart = useCallback((e: TouchEvent<HTMLElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);
  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      if (touchStartX.current == null) return;
      const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta < 0) next();
        else prev();
      }
      touchStartX.current = null;
    },
    [next, prev]
  );

  // Mark a slide as fully loaded
  const handleImageLoad = useCallback((i: number) => {
    setLoaded((set) => {
      if (set.has(i)) return set;
      const next = new Set(set);
      next.add(i);
      return next;
    });
  }, []);

  const animDur = reducedMotion ? 'duration-0' : 'duration-[1400ms]';
  const textDur = reducedMotion ? 'duration-0' : 'duration-700';
  const kenBurns = reducedMotion ? '' : 'animate-kenburns';

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate overflow-hidden bg-neutral-900 text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      style={{ contain: 'layout paint' }}
    >
      {/* Background slides layer */}
      <div className="absolute inset-0">
        {slides.map((s, i) => {
          const isActive = i === active;
          const isLoaded = loaded.has(i);
          const loadingAttr = i === 0 ? 'eager' : 'lazy';
          const fetchPriority = isActive ? 'high' : 'low';
          return (
            <div
              key={i}
              className={clsx(
                'absolute inset-0 transition-opacity ease-in-out',
                animDur,
                isActive ? 'opacity-100' : 'opacity-0'
              )}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}: ${s.alt}`}
            >
              {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={isActive ? s.alt : ''}
                loading={loadingAttr as 'eager' | 'lazy'}
                decoding="async"
                // @ts-expect-error - fetchpriority is a valid HTML attribute
                fetchpriority={fetchPriority}
                draggable={false}
                onLoad={() => handleImageLoad(i)}
                onError={() => handleImageLoad(i)}
                className={clsx(
                  'h-full w-full object-cover transition-opacity ease-out',
                  textDur,
                  isLoaded ? 'opacity-100' : 'opacity-0',
                  isActive && isLoaded ? kenBurns : '',
                  'will-change-transform'
                )}
              />
              {/* Two-layer gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Subtle vignette */}
              <div className="absolute inset-0 [box-shadow:inset_0_0_200px_rgba(0,0,0,0.45)]" />
            </div>
          );
        })}
      </div>

      {/* Decorative side accent */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
        <div className="flex h-32 w-1 -translate-x-px items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-brand-400/60 to-transparent">
          <div className="h-8 w-1 animate-pulse bg-brand-400" />
        </div>
      </div>

      {/* Content layer */}
      <div className="relative container-narrow flex min-h-[640px] flex-col justify-center py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          {slides.map((s, i) => (
            <div
              key={i}
              className={clsx(
                'transition-all ease-out',
                textDur,
                i === active
                  ? 'pointer-events-auto relative translate-y-0 opacity-100'
                  : 'pointer-events-none absolute inset-0 translate-y-4 opacity-0'
              )}
              aria-hidden={i !== active}
            >
              <span
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm ring-1 ring-white/25 backdrop-blur-md',
                  textDur,
                  'transition-all ease-out delay-75'
                )}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                {s.eyebrow}
              </span>
              <h1
                className={clsx(
                  'mt-5 font-display text-4xl font-semibold leading-[1.05] drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl text-balance',
                  textDur,
                  'transition-all ease-out delay-150'
                )}
              >
                <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  {s.title}
                </span>
              </h1>
              <p
                className={clsx(
                  'mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg',
                  textDur,
                  'transition-all ease-out delay-300'
                )}
              >
                {s.subtitle}
              </p>
            </div>
          ))}

          {/* CTAs (static across slides) */}
          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            {ctaPrimary && (
              <a
                href={ctaPrimary.href}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30"
              >
                {ctaPrimary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
            {ctaSecondary && (
              <a
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/60"
              >
                {ctaSecondary.label}
              </a>
            )}
          </div>

          {badges && <div className="relative mt-10">{badges}</div>}
        </div>
      </div>

      {/* Right-side mini meta panel */}
      <div className="absolute right-6 top-6 z-10 hidden flex-col items-end gap-2 sm:flex">
        <div className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm ring-1 ring-white/10">
          {slides[active]?.eyebrow}
        </div>
      </div>

      {/* Arrows + Pause/Play */}
      <div className="absolute left-4 right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-between pointer-events-none sm:flex">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom controls: indicators + pause + counter */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-6 pb-6">
        {/* Indicators with progress */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md ring-1 ring-white/15 transition-colors hover:bg-black/50"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <div
            className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-md"
            role="tablist"
            aria-label="Choose slide"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="group relative h-1.5 overflow-hidden rounded-full transition-all duration-500"
                style={{ width: i === active ? '2rem' : '0.5rem' }}
              >
                <span
                  className={clsx(
                    'absolute inset-0 rounded-full transition-colors',
                    i === active ? 'bg-white/30' : 'bg-white/60 group-hover:bg-white/90'
                  )}
                />
                {i === active && !paused && (
                  <span
                    key={progressKey}
                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                    style={{
                      animation: `hero-progress ${intervalMs}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="hidden items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-md ring-1 ring-white/10 sm:flex">
          <span className="text-sm font-semibold tabular-nums text-white">
            {String(active + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-white/50">/</span>
          <span className="text-xs tabular-nums text-white/70">
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-white/50 sm:block">
        <span className="opacity-0">.</span>
      </div>
    </section>
  );
}
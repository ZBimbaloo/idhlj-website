type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
};

export function PageHero({ eyebrow, title, subtitle, image }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-sand-50 to-white">
      {image && (
        <div className="absolute inset-0 -z-10 opacity-[0.06]">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
      )}
      <div className="container-narrow py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg text-balance">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
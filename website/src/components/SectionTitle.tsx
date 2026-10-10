type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  titleClassName?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  titleClassName,
}: Props) {
  const isCenter = align === 'center';
  return (
    <div
      className={
        isCenter
          ? 'mx-auto max-w-3xl text-center'
          : 'max-w-3xl'
      }
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`mt-3 font-display text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl text-balance ${titleClassName || ''}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
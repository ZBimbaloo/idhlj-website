'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

type Props = {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto';
  sizes?: string;
  priority?: boolean;
};

const aspectClasses: Record<NonNullable<Props['aspectRatio']>, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
  auto: '',
};

export function SmartImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-neutral-100',
        aspectClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={clsx(
          'object-cover transition-opacity duration-700',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        unoptimized={src.includes('trae-api-cn.mchost.guru')}
      />
    </div>
  );
}
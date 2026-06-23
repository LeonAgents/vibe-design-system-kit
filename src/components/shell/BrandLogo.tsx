import Image from 'next/image';

import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: number;
  className?: string;
  title?: string;
  src?: string | null;
  alt?: string;
}

export function BrandLogo({
  size = 28,
  className,
  title,
  src,
  alt,
}: BrandLogoProps) {
  if (src) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--bg-card)]',
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt ?? title ?? '品牌 Logo'}
          width={size}
          height={size}
          unoptimized
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  // 通用占位 Logo：品牌色圆角方块 + 白色递增条形。替换为你自己的品牌标识即可。
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={cn('shrink-0', className)}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect width="24" height="24" rx="6" fill="var(--highlight)" />
      <rect x="6" y="12.5" width="3" height="5.5" rx="1.5" fill="var(--highlight-foreground)" />
      <rect x="10.5" y="9" width="3" height="9" rx="1.5" fill="var(--highlight-foreground)" />
      <rect x="15" y="6" width="3" height="12" rx="1.5" fill="var(--highlight-foreground)" />
    </svg>
  );
}

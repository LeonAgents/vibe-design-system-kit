import type { LucideIcon, LucideProps } from 'lucide-react';
import type { CSSProperties } from 'react';

interface IconProps {
    icon: LucideIcon;
    /** Icon color — defaults to `currentColor` (inherits from parent text color) */
    color?: string;
    /** Icon size in px — defaults to 20, matching platform 20×20 spec */
    size?: number;
    /** Extra style merged onto the SVG element */
    style?: CSSProperties;
    className?: string;
    /** Extra props forwarded to the Lucide SVG element */
    svgProps?: Omit<LucideProps, 'size' | 'color' | 'strokeWidth' | 'strokeLinecap' | 'strokeLinejoin'>;
}

/**
 * Standardized platform icon.
 *
 * - Container: 20×20 px (configurable via `containerSize`)
 * - SVG icon:  18×18 px (configurable via `iconSize`), centered
 * - Stroke:    width 1, linecap round, linejoin round
 *
 * For card-level display icons that need a colored background block,
 * wrap `<Icon>` inside your own styled container.
 */
export default function Icon({
    icon: LucideComponent,
    color,
    size = 18,
    style,
    className,
    svgProps,
}: IconProps) {
    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                flexShrink: 0,
                lineHeight: 0,
                ...style,
            }}
        >
            <LucideComponent
                size={size}
                color={color}
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                {...svgProps}
            />
        </span>
    );
}

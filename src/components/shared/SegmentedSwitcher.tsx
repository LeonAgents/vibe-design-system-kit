'use client';

import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';

export type SegmentItem<K extends string = string> = {
    key: K;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
};

type Variant = 'pill' | 'underline';
type Size = 'sm' | 'md';

type Props<K extends string> = {
    value: K;
    onChange: (key: K) => void;
    items: SegmentItem<K>[];
    /** pill = 圆角胶囊背景；underline = 底部下划线 */
    variant?: Variant;
    size?: Size;
    /** 平分宽度（用于面板内 Tab） */
    fullWidth?: boolean;
    /** 选中态色彩，默认 var(--highlight) */
    activeColor?: string;
    /** pill 模式选中文案颜色，默认白色 */
    activeTextColor?: string;
    /** 未选中文案颜色，默认 var(--text-regular) */
    inactiveTextColor?: string;
    className?: string;
    style?: CSSProperties;
};

export default function SegmentedSwitcher<K extends string>({
    value,
    onChange,
    items,
    variant = 'pill',
    size = 'md',
    fullWidth = false,
    activeColor = 'var(--highlight)',
    activeTextColor,
    inactiveTextColor = 'var(--text-regular)',
    className,
    style,
}: Props<K>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
        left: 0,
        width: 0,
        ready: false,
    });
    const [hoveredKey, setHoveredKey] = useState<K | null>(null);

    const measure = () => {
        const c = containerRef.current;
        const b = btnRefs.current[value as string];
        if (!c || !b) return;
        const cR = c.getBoundingClientRect();
        const bR = b.getBoundingClientRect();
        setIndicator({
            left: bR.left - cR.left,
            width: bR.width,
            ready: true,
        });
    };

    useLayoutEffect(() => {
        measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, items.length]);

    useEffect(() => {
        const onResize = () => measure();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isPill = variant === 'pill';
    const buttonHeight = size === 'sm' ? 32 : 40;
    const padX = size === 'sm' ? 16 : 24;
    const fontSize = size === 'sm' ? 12 : 14;
    const minWidth = size === 'sm' ? 64 : 80;

    const containerStyle: CSSProperties = isPill
        ? {
              position: 'relative',
              display: fullWidth ? 'flex' : 'inline-flex',
              boxSizing: 'border-box',
              height: size === 'sm' ? 40 : 48,
              padding: 4,
              borderRadius: 8,
              background: 'transparent',
              gap: 8,
              alignItems: 'center',
              ...style,
          }
        : {
              position: 'relative',
              display: fullWidth ? 'flex' : 'inline-flex',
              borderBottom: '1px solid var(--border-divider)',
              gap: 0,
              ...style,
          };

    const indicatorStyle: CSSProperties = isPill
        ? {
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: 0,
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
              borderRadius: 6,
              background: activeColor,
              opacity: indicator.ready ? 1 : 0,
              pointerEvents: 'none',
          }
        : {
              position: 'absolute',
              left: 0,
              bottom: -1,
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
              height: 2,
              borderRadius: 2,
              background: activeColor,
              opacity: indicator.ready ? 1 : 0,
              pointerEvents: 'none',
          };

    return (
        <div ref={containerRef} className={className} style={containerStyle}>
            <div aria-hidden className="segment-indicator" style={indicatorStyle} />
            {items.map(({ key, label, icon, disabled }) => {
                const active = value === key;
                const showHover = !active && !disabled && hoveredKey === key;
                return (
                    <button
                        key={key}
                        type="button"
                        ref={(el) => {
                            btnRefs.current[key as string] = el;
                        }}
                        onClick={() => !disabled && onChange(key)}
                        onMouseEnter={() => !disabled && setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey((prev) => (prev === key ? null : prev))}
                        onFocus={() => !disabled && setHoveredKey(key)}
                        onBlur={() => setHoveredKey((prev) => (prev === key ? null : prev))}
                        disabled={disabled}
                        style={{
                            position: 'relative',
                            boxSizing: 'border-box',
                            zIndex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            flex: fullWidth ? 1 : '0 0 auto',
                            minWidth: isPill ? minWidth : undefined,
                            height: isPill ? buttonHeight : undefined,
                            padding: isPill ? `0 ${padX}px` : '9px 0',
                            border: 'none',
                            borderRadius: isPill ? 6 : 0,
                            background: active
                                ? 'transparent'
                                : isPill
                                    ? showHover
                                        ? 'color-mix(in srgb, var(--text-secondary) 20%, transparent)'
                                        : 'var(--text-decorative)'
                                    : showHover
                                        ? 'color-mix(in srgb, var(--text-secondary) 6%, transparent)'
                                        : 'transparent',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.5 : 1,
                            fontSize,
                            fontWeight: active ? (isPill ? 500 : 700) : 400,
                            fontFamily: 'var(--font-sans)',
                            lineHeight: 1,
                            color: active
                                ? isPill
                                    ? activeTextColor ?? 'white'
                                    : activeColor
                                : showHover
                                    ? 'var(--text-strong)'
                                    : inactiveTextColor,
                            transition:
                                'background 160ms var(--motion-ease-out), color 220ms var(--motion-ease-out), font-weight 220ms var(--motion-ease-out)',
                        }}
                    >
                        {icon}
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

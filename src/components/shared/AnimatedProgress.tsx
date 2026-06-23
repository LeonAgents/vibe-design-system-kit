'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * AnimatedProgress
 * - 进度条宽度从 0 平滑动画到 value%
 * - 进入视口后才开始
 * - prefers-reduced-motion 时直接显示终态
 */

type Props = {
    value: number;                 // 0 - 100
    color?: string;                // 进度颜色，默认 var(--highlight)
    track?: string;                // 轨道颜色，默认 var(--border-divider)
    height?: number;
    radius?: number;
    duration?: number;             // ms
    style?: CSSProperties;
    className?: string;
};

export default function AnimatedProgress({
    value,
    color = 'var(--highlight)',
    track = 'var(--border-divider)',
    height = 8,
    radius = 999,
    duration = 800,
    style,
    className,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [reduced, setReduced] = useState(false);
    const safeValue = Math.max(0, Math.min(100, value));

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        // 媒体查询初始值同步读取（不是 effect 内级联更新）
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReduced(mq.matches);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener?.('change', onChange);
        return () => mq.removeEventListener?.('change', onChange);
    }, []);

    useEffect(() => {
        if (hasStarted) return;
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setHasStarted(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setHasStarted(true);
                    io.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [hasStarted]);

    const fillWidth = !hasStarted ? 0 : safeValue;
    const transitionStr = reduced
        ? 'none'
        : `width ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                position: 'relative',
                height,
                background: track,
                borderRadius: radius,
                overflow: 'hidden',
                ...style,
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${fillWidth}%`,
                    background: color,
                    borderRadius: radius,
                    transition: transitionStr,
                }}
            />
        </div>
    );
}

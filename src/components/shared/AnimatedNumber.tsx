'use client';

import { type CSSProperties } from 'react';

/**
 * AnimatedNumber
 * - 已移除数字滚动动画：直接渲染最终值。
 * - 保留 className/style/prefix/suffix/format/decimals 等 props 接口，
 *   调用方无需修改。
 */

type Props = {
    value: number;
    /** @deprecated 不再使用，保留以兼容旧调用。 */
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    format?: (n: number) => string;
    className?: string;
    style?: CSSProperties;
    /** @deprecated 不再使用，保留以兼容旧调用。 */
    startOnView?: boolean;
};

export default function AnimatedNumber({
    value,
    decimals = 0,
    prefix = '',
    suffix = '',
    format,
    className,
    style,
}: Props) {
    const formatted = format ? format(value) : value.toFixed(decimals);
    return (
        <span className={className} style={style}>
            {prefix}
            {formatted}
            {suffix}
        </span>
    );
}

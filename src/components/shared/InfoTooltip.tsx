'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface InfoTooltipProps {
    description: React.ReactNode;
    formula?: React.ReactNode;
    size?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    iconColor?: string;
    className?: string;
}

export function InfoTooltip({
    description,
    formula,
    size = 14,
    side = 'top',
    align = 'center',
    iconColor = 'var(--text-secondary)',
    className,
}: InfoTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label="info"
                    className={className}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: size + 2,
                        height: size + 2,
                        padding: 0,
                        background: 'transparent',
                        border: 'none',
                        color: iconColor,
                        cursor: 'help',
                        verticalAlign: 'middle',
                        opacity: 0.6,
                        transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                >
                    <Info size={size} strokeWidth={2} />
                </button>
            </TooltipTrigger>
            <TooltipContent
                side={side}
                align={align}
                sideOffset={6}
                className="max-w-xs whitespace-normal text-left leading-relaxed"
            >
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                    {typeof description === 'string' ? <span>{description}</span> : description}
                    {formula && (
                        <div
                            style={{
                                marginTop: 6,
                                paddingTop: 6,
                                borderTop: '1px solid color-mix(in srgb, var(--highlight-foreground) 15%, transparent)',
                                fontFamily: 'var(--font-data)',
                                fontSize: 11,
                                opacity: 0.85,
                            }}
                        >
                            {formula}
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    );
}

export interface TermLabelProps {
    children: React.ReactNode;
    description: React.ReactNode;
    formula?: React.ReactNode;
    side?: InfoTooltipProps['side'];
    iconSize?: number;
    style?: React.CSSProperties;
    className?: string;
    iconColor?: string;
}

export function TermLabel({
    children,
    description,
    formula,
    side,
    iconSize,
    style,
    className,
    iconColor,
}: TermLabelProps) {
    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                ...style,
            }}
        >
            {children}
            <InfoTooltip
                description={description}
                formula={formula}
                size={iconSize}
                side={side}
                iconColor={iconColor}
            />
        </span>
    );
}

export default InfoTooltip;

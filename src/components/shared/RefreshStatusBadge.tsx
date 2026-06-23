'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshStatusBadgeProps {
    intervalMs?: number;
    onRefresh: () => void;
    lastUpdatedLabel?: string;
}

export default function RefreshStatusBadge({
    intervalMs = 300_000,
    onRefresh,
    lastUpdatedLabel = '上次更新',
}: RefreshStatusBadgeProps) {
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const remainingRef = useRef(intervalMs / 1000);

    const doRefresh = useCallback(() => {
        setIsRefreshing(true);
        onRefresh();
        setLastUpdated(new Date());
        remainingRef.current = intervalMs / 1000;
        setTimeout(() => setIsRefreshing(false), 600);
    }, [onRefresh, intervalMs]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            remainingRef.current -= 1;
            if (remainingRef.current <= 0) {
                doRefresh();
            }
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [doRefresh]);

    const fmt = (d: Date) => {
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: 'var(--text-decorative)',
                fontFamily: "'SF Mono', Menlo, monospace",
                whiteSpace: 'nowrap',
            }}
        >
            <button
                type="button"
                aria-label="刷新数据"
                onClick={doRefresh}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isRefreshing ? 'var(--highlight)' : 'var(--text-decorative)',
                }}
            >
                <RefreshCw
                    size={14}
                    style={{
                        transition: 'transform 0.6s ease',
                        transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
                    }}
                />
            </button>
            <span>{lastUpdatedLabel} {fmt(lastUpdated)}</span>
        </div>
    );
}

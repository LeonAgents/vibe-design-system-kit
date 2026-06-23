'use client';

import React from 'react';

export type EmptyStateVariant =
  | 'no-search'
  | 'no-creation'
  | 'no-data'
  | 'processing'
  | 'error';

export interface EmptyStateProps {
  variant: EmptyStateVariant;
  size?: 'compact' | 'standard';
  className?: string;
  action?: React.ReactNode;
}

const VARIANT_CONFIG: Record<EmptyStateVariant, { text: string; icon: React.ReactNode }> = {
  'no-search': {
    text: '暂无搜索内容',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="28" cy="28" r="18" stroke="var(--border-divider)" strokeWidth="3" />
        <line x1="40.5" y1="40.5" x2="54" y2="54" stroke="var(--border-divider)" strokeWidth="3" strokeLinecap="round" />
        <line x1="22" y1="28" x2="34" y2="28" stroke="var(--highlight)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  'no-creation': {
    text: '您还未开始创作',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="12" width="40" height="40" rx="4" stroke="var(--border-divider)" strokeWidth="3" />
        <line x1="32" y1="24" x2="32" y2="40" stroke="var(--highlight)" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="32" x2="40" y2="32" stroke="var(--highlight)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  'no-data': {
    text: '暂无数据',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="10" y="14" width="44" height="36" rx="4" stroke="var(--border-divider)" strokeWidth="3" />
        <line x1="18" y1="26" x2="46" y2="26" stroke="var(--border-divider)" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="34" x2="38" y2="34" stroke="var(--border-divider)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="42" cy="42" r="2" fill="var(--highlight)" />
      </svg>
    ),
  },
  processing: {
    text: '数据整理中',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="20" stroke="var(--border-divider)" strokeWidth="3" />
        <path d="M32 16 A16 16 0 0 1 48 32" stroke="var(--highlight)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  error: {
    text: '系统出错了',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="20" stroke="var(--border-divider)" strokeWidth="3" />
        <line x1="32" y1="22" x2="32" y2="36" stroke="var(--highlight)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="42" r="2" fill="var(--highlight)" />
      </svg>
    ),
  },
};

const SIZES = {
  compact: { width: 200, height: 130, iconScale: 0.8 },
  standard: { width: 400, height: 280, iconScale: 1.2 },
} as const;

export function EmptyState({
  variant,
  size = 'standard',
  className,
  action,
}: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];
  const sizeConfig = SIZES[size];

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeConfig.width,
        height: sizeConfig.height,
        margin: '0 auto',
        gap: 16,
      }}
    >
      <div
        style={{
          transform: `scale(${sizeConfig.iconScale})`,
          transformOrigin: 'center',
        }}
      >
        {config.icon}
      </div>
      <span
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: '20px',
        }}
      >
        {config.text}
      </span>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

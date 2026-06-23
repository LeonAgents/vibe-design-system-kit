'use client';

import React from 'react';

export interface ChartFlowProps {
  steps: { label: string; description?: string }[];
  height?: number | string;
  className?: string;
}

export function ChartFlow({ steps, height, className }: ChartFlowProps) {
  if (!steps.length) return null;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        height,
        gap: 0,
        padding: '16px 0',
      }}
    >
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 120,
              maxWidth: 200,
              padding: '12px 16px',
              background:
                i === 0 || i === steps.length - 1
                  ? 'var(--highlight)'
                  : 'var(--bg-card)',
              border: '1px solid var(--border-divider)',
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color:
                  i === 0 || i === steps.length - 1
                    ? 'var(--highlight-foreground)'
                    : 'var(--text-regular)',
                textAlign: 'center',
                lineHeight: '20px',
              }}
            >
              {step.label}
            </span>
            {step.description && (
              <span
                style={{
                  fontSize: 12,
                  color:
                    i === 0 || i === steps.length - 1
                      ? 'color-mix(in srgb, var(--highlight-foreground) 80%, transparent)'
                      : 'var(--text-secondary)',
                  marginTop: 4,
                  textAlign: 'center',
                  lineHeight: '16px',
                }}
              >
                {step.description}
              </span>
            )}
          </div>
          {i < steps.length - 1 && (
            <svg
              width="32"
              height="16"
              viewBox="0 0 32 16"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <line
                x1="0"
                y1="8"
                x2="24"
                y2="8"
                stroke="var(--border-divider)"
                strokeWidth="1.5"
              />
              <path
                d="M24 3 L30 8 L24 13"
                stroke="var(--border-divider)"
                strokeWidth="1.5"
                fill="none"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

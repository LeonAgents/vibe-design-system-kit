'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartFunnelProps {
  title?: string;
  data: { name: string; value: number }[];
  height?: number | string;
  showLabel?: boolean;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

const FONT_DATA = '"DIN Alternate", "SF Mono", "Fira Code", Consolas, monospace';

export function ChartFunnel({
  title,
  data,
  height = 320,
  showLabel = true,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartFunnelProps) {
  const { chartTheme, getChartColor, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const maxVal = sorted[0]?.value ?? 1;
    const total = sorted.length;

    const opt: EChartsOption = {
      ...chartTheme,
      title: title ? { ...chartTheme.title, text: title } : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'item',
        formatter: (params: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = params as any;
          const pct = ((p.value / maxVal) * 100).toFixed(1);
          return `<div style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
            <span style="color:${tokens.text.secondary}">${p.name}</span>
            <span style="font-family:${FONT_DATA};font-weight:700;color:${tokens.text.strong};margin-left:8px">${p.value?.toLocaleString()}</span>
            <span style="color:${tokens.text.secondary}">(${pct}%)</span>
          </div>`;
        },
      },
      legend: { show: false },
      series: [
        {
          type: 'funnel',
          sort: 'descending',
          left: '10%',
          top: 48,
          bottom: 16,
          width: '80%',
          gap: 2,
          label: {
            show: showLabel,
            position: 'inside',
            formatter: (params: unknown) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const p = params as any;
              const pct = ((p.value / maxVal) * 100).toFixed(1);
              return `${p.name}  ${pct}%`;
            },
            fontSize: 14,
            color: tokens.text.regular,
          },
          itemStyle: {
            borderWidth: 0,
          },
          data: sorted.map((d, i) => {
            const MIN_OPACITY = 0.15;
            const opacity = Math.max(MIN_OPACITY, 1 - (i / Math.max(total - 1, 1)));
            const hex = Math.round(opacity * 255)
              .toString(16)
              .padStart(2, '0');
            return {
              name: d.name,
              value: d.value,
              itemStyle: { color: `${getChartColor(i)}${hex}` },
            };
          }),
        },
      ],
      ...optionOverrides,
    };
    return opt;
  }, [title, data, showLabel, optionOverrides, chartTheme, getChartColor, tokens]);

  return (
    <EChartsBase
      option={option}
      height={height}
      loading={loading}
      className={className}
      onEvents={onEvents}
    />
  );
}

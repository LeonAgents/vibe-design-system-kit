'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartRadarProps {
  title?: string;
  indicators: { name: string; max: number }[];
  series: { name: string; values: number[] }[];
  height?: number | string;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function ChartRadar({
  title,
  indicators,
  series,
  height = 320,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartRadarProps) {
  const { chartTheme, getChartColor, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const opt: EChartsOption = {
      ...chartTheme,
      color: series.map((_, i) => getChartColor(i)),
      title: title
        ? { ...chartTheme.title, text: title }
        : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'item',
      },
      legend: {
        ...chartTheme.legend,
        show: series.length > 1,
      },
      radar: {
        indicator: indicators.map((ind) => ({
          name: ind.name,
          max: ind.max,
        })),
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: tokens.text.secondary,
          fontSize: 12,
        },
        splitArea: {
          areaStyle: {
            color: [
              `${tokens.background.primary}66`,
              `${tokens.background.secondary}66`,
            ],
          },
        },
        splitLine: {
          lineStyle: { color: tokens.border.divider },
        },
        axisLine: {
          lineStyle: { color: tokens.border.divider },
        },
      },
      series: [
        {
          type: 'radar',
          data: series.map((s, i) => ({
            name: s.name,
            value: s.values,
            lineStyle: { color: getChartColor(i), width: 2 },
            areaStyle: { color: `${getChartColor(i)}1A` },
            itemStyle: { color: getChartColor(i) },
            symbol: 'circle',
            symbolSize: 4,
          })),
        },
      ],
    };
    if (optionOverrides) {
      for (const [k, v] of Object.entries(optionOverrides)) {
        const key = k as keyof EChartsOption;
        if (v && typeof v === 'object' && !Array.isArray(v) && opt[key] && typeof opt[key] === 'object' && !Array.isArray(opt[key])) {
          (opt as Record<string, unknown>)[k] = { ...(opt[key] as Record<string, unknown>), ...(v as Record<string, unknown>) };
        } else {
          (opt as Record<string, unknown>)[k] = v;
        }
      }
    }
    return opt;
  }, [title, indicators, series, optionOverrides, chartTheme, getChartColor, tokens]);

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

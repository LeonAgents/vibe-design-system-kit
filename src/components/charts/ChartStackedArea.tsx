'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartStackedAreaProps {
  title?: string;
  xData: string[];
  series: { name: string; data: number[] }[];
  unit?: string;
  height?: number | string;
  smooth?: boolean;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function ChartStackedArea({
  title,
  xData,
  series,
  unit,
  height = 320,
  smooth = true,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartStackedAreaProps) {
  const { chartTheme, axisStyleX, axisStyleY, getChartColor, makeTooltipFormatter, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const opt: EChartsOption = {
      ...chartTheme,
      color: series.map((_, i) => getChartColor(i)),
      title: title
        ? { ...chartTheme.title, text: title }
        : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: tokens.text.secondary } },
        formatter: makeTooltipFormatter(unit),
      },
      legend: {
        ...chartTheme.legend,
        show: series.length > 1,
      },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false,
        ...axisStyleX,
      },
      yAxis: {
        type: 'value',
        ...axisStyleY,
      },
      grid: chartTheme.grid,
      series: series.map((s, i) => ({
        name: s.name,
        type: 'line' as const,
        stack: 'total',
        data: s.data,
        smooth,
        symbol: 'none',
        lineStyle: { width: 1.5 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${getChartColor(i)}1A` },
              { offset: 1, color: `${getChartColor(i)}05` },
            ],
          },
        },
        emphasis: { focus: 'series' as const },
      })),
      ...optionOverrides,
    };
    return opt;
  }, [title, xData, series, unit, smooth, optionOverrides, chartTheme, axisStyleX, axisStyleY, getChartColor, makeTooltipFormatter, tokens]);

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

'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartBarProps {
  title?: string;
  xData: string[];
  series: { name: string; data: number[] }[];
  unit?: string;
  height?: number | string;
  horizontal?: boolean;
  stacked?: boolean;
  barWidth?: number;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function ChartBar({
  title,
  xData,
  series,
  unit,
  height = 320,
  horizontal = false,
  stacked = false,
  barWidth,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartBarProps) {
  const { chartTheme, axisStyleX, axisStyleY, getChartColor, makeTooltipFormatter } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const categoryAxis = {
      type: 'category' as const,
      data: xData,
      ...axisStyleX,
    };
    const valueAxis = {
      type: 'value' as const,
      ...axisStyleY,
    };

    const opt: EChartsOption = {
      ...chartTheme,
      color: series.map((_, i) => getChartColor(i)),
      title: title
        ? { ...chartTheme.title, text: title }
        : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: makeTooltipFormatter(unit),
      },
      legend: {
        ...chartTheme.legend,
        show: series.length > 1,
      },
      xAxis: horizontal ? valueAxis : categoryAxis,
      yAxis: horizontal ? categoryAxis : valueAxis,
      grid: chartTheme.grid,
      series: series.map((s, i) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.data,
        stack: stacked ? 'total' : undefined,
        barWidth: barWidth ?? (series.length === 1 ? 24 : undefined),
        itemStyle: {
          borderRadius: stacked
            ? undefined
            : horizontal
              ? [0, 4, 4, 0]
              : [4, 4, 0, 0],
          color: getChartColor(i),
        },
        emphasis: { focus: 'series' as const },
      })),
      ...optionOverrides,
    };
    return opt;
  }, [title, xData, series, unit, horizontal, stacked, barWidth, optionOverrides, chartTheme, axisStyleX, axisStyleY, getChartColor, makeTooltipFormatter]);

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

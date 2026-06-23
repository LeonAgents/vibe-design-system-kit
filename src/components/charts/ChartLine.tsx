'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartLineSeries {
  name: string;
  data: (number | null)[];
  dashed?: boolean;
  color?: string;
}

export interface ChartLineProps {
  title?: string;
  xData: string[];
  series: ChartLineSeries[];
  extraSeries?: NonNullable<EChartsOption['series']>;
  unit?: string;
  height?: number | string;
  showArea?: boolean;
  smooth?: boolean;
  dualSeries?: boolean;
  xAxisLabelMargin?: number;
  yAxisLabelMargin?: number;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function ChartLine({
  title,
  xData,
  series,
  extraSeries,
  unit,
  height = 320,
  showArea = false,
  smooth = true,
  dualSeries = false,
  xAxisLabelMargin,
  yAxisLabelMargin,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartLineProps) {
  const {
    chartTheme,
    axisStyleX,
    axisStyleY,
    dualSeriesColors,
    getChartColor,
    makeTooltipFormatter,
    tokens,
  } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const colors = series.map((s, i) =>
      s.color ??
        (dualSeries
          ? dualSeriesColors[i % dualSeriesColors.length]
          : getChartColor(i)),
    );

    const opt: EChartsOption = {
      ...chartTheme,
      color: colors,
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
        axisLabel: {
          ...axisStyleX.axisLabel,
          margin: xAxisLabelMargin ?? axisStyleX.axisLabel.margin,
        },
      },
      yAxis: {
        type: 'value',
        ...axisStyleY,
        axisLabel: {
          ...axisStyleY.axisLabel,
          margin: yAxisLabelMargin ?? 8,
        },
      },
      grid: chartTheme.grid,
      series: [
        ...series.map((s, i) => ({
          name: s.name,
          type: 'line' as const,
          data: s.data,
          color: colors[i],
          smooth,
          symbol: 'none' as const,
          lineStyle: {
            color: colors[i],
            width: 2,
            type: s.dashed ? ('dashed' as const) : ('solid' as const),
          },
          itemStyle: { color: colors[i] },
          areaStyle: showArea
            ? {
                color: {
                  type: 'linear' as const,
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: `${colors[i % colors.length]}1A` },
                    { offset: 1, color: `${colors[i % colors.length]}05` },
                  ],
                },
              }
            : undefined,
          emphasis: { focus: 'series' as const },
        })),
        ...(Array.isArray(extraSeries) ? extraSeries : extraSeries ? [extraSeries] : []),
      ],
      ...optionOverrides,
    };
    return opt;
  }, [title, xData, series, extraSeries, unit, showArea, smooth, dualSeries, xAxisLabelMargin, yAxisLabelMargin, optionOverrides, chartTheme, axisStyleX, axisStyleY, dualSeriesColors, getChartColor, makeTooltipFormatter, tokens]);

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

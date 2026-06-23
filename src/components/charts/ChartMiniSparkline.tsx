'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartMiniSparklineProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  className?: string;
}

export function ChartMiniSparkline({
  data,
  width = 120,
  height = 32,
  color,
  className,
}: ChartMiniSparklineProps) {
  const { getChartColor } = useChartTheme();
  const resolvedColor = color ?? getChartColor(0);

  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: {
      type: 'category',
      show: false,
      data: data.map((_, i) => i),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: (value: { min: number }) => value.min * 0.9,
    },
    tooltip: { show: false },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1.5, color: resolvedColor },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${resolvedColor}0D` },
              { offset: 1, color: `${resolvedColor}03` },
            ],
          },
        },
      },
    ],
  }), [data, resolvedColor]);

  return (
    <EChartsBase
      option={option}
      width={width}
      height={height}
      className={className}
    />
  );
}

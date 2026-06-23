'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

const FONT_DATA = '"DIN Alternate", "SF Mono", "Fira Code", Consolas, monospace';

export interface ChartBubbleProps {
  title?: string;
  xData?: string[];
  series: { name: string; data: [number, number, number][] }[];
  unit?: string;
  height?: number | string;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function ChartBubble({
  title,
  xData,
  series,
  unit,
  height = 320,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartBubbleProps) {
  const { chartTheme, axisStyleX, axisStyleY, getChartColor, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const allSizes = series.flatMap((s) => s.data.map((d) => d[2]));
    const maxSize = Math.max(...allSizes, 1);

    const opt: EChartsOption = {
      ...chartTheme,
      title: title ? { ...chartTheme.title, text: title } : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'item',
        formatter: (params: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = params as any;
          const val = Array.isArray(p.value) ? p.value : [p.value];
          let html = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">`;
          html += `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>`;
          html += `<span style="color:${tokens.text.secondary}">${p.seriesName}</span>`;
          html += `</div>`;
          html += `<div style="font-family:${FONT_DATA};font-weight:700;color:${tokens.text.strong}">`;
          html += `${val[0]}, ${val[1]}`;
          if (val[2] !== undefined) html += ` (${val[2].toLocaleString()}${unit ?? ''})`;
          html += `</div>`;
          return html;
        },
      },
      legend: {
        ...chartTheme.legend,
        show: series.length > 1,
        data: series.map((s, i) => ({
          name: s.name,
          itemStyle: { color: getChartColor(i) },
        })),
      },
      xAxis: xData
        ? { type: 'category' as const, data: xData, ...axisStyleX }
        : { type: 'value' as const, ...axisStyleX },
      yAxis: {
        type: 'value' as const,
        ...axisStyleY,
      },
      series: series.map((s, i) => {
        const color = getChartColor(i);
        return {
          name: s.name,
          type: 'scatter' as const,
          data: s.data,
          symbolSize: (val: number[]) =>
            Math.max(8, (val[2] / maxSize) * 60),
          itemStyle: {
            color: `${color}66`,
            borderColor: color,
            borderWidth: 1,
          },
        };
      }),
      ...optionOverrides,
    };
    return opt;
  }, [title, xData, series, unit, optionOverrides, chartTheme, axisStyleX, axisStyleY, getChartColor, tokens]);

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

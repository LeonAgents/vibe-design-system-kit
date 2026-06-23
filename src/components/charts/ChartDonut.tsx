'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartDonutProps {
  title?: string;
  data: { name: string; value: number }[];
  height?: number | string;
  centerText?: string;
  innerRadius?: string;
  outerRadius?: string;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

const FONT_DATA = '"DIN Alternate", "SF Mono", "Fira Code", Consolas, monospace';

export function ChartDonut({
  title,
  data,
  height = 320,
  centerText,
  innerRadius = '55%',
  outerRadius = '75%',
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartDonutProps) {
  const { chartTheme, getChartColor, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const opt: EChartsOption = {
      ...chartTheme,
      color: data.map((_, i) => getChartColor(i)),
      title: title
        ? { ...chartTheme.title, text: title }
        : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'item',
        formatter: (params: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = params as any;
          return `<div style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
            <span style="color:${tokens.text.secondary}">${p.name}</span>
            <span style="font-family:${FONT_DATA};font-weight:700;color:${tokens.text.strong};margin-left:8px">${p.value?.toLocaleString()}</span>
            <span style="color:${tokens.text.secondary}">(${p.percent}%)</span>
          </div>`;
        },
      },
      legend: {
        ...chartTheme.legend,
        show: true,
        orient: 'vertical',
        left: 800,
        right: 'auto',
        top: 'middle',
        itemGap: 24,
      },
      series: [
        {
          type: 'pie',
          radius: [innerRadius, outerRadius],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: centerText
            ? {
                show: true,
                position: 'center',
                formatter: centerText,
                fontSize: 20,
                fontWeight: 700,
                fontFamily: FONT_DATA,
                color: tokens.text.strong,
              }
            : { show: false },
          emphasis: {
            label: centerText
              ? { show: true, fontSize: 20, fontWeight: 700 }
              : { show: false },
            scaleSize: 4,
          },
          labelLine: { show: false },
          data: data.map((d, i) => ({
            ...d,
            itemStyle: { color: getChartColor(i) },
          })),
          itemStyle: {
            borderColor: tokens.background.card,
            borderWidth: 2,
          },
        },
      ],
      ...optionOverrides,
    };
    return opt;
  }, [title, data, centerText, innerRadius, outerRadius, optionOverrides, chartTheme, getChartColor, tokens]);

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

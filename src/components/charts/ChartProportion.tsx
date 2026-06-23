'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartProportionProps {
  title?: string;
  data: { name: string; value: number }[];
  height?: number | string;
  showPercentLabel?: boolean;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

const FONT_DATA = '"DIN Alternate", "SF Mono", "Fira Code", Consolas, monospace';

function getLabelFontSize(rank: number): number {
  if (rank === 0) return 48;
  if (rank === 1) return 28;
  return 20;
}

export function ChartProportion({
  title,
  data,
  height = 320,
  showPercentLabel = true,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartProportionProps) {
  const { chartTheme, getChartColor, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const rankMap = new Map<string, number>();
    sorted.forEach((d, i) => rankMap.set(d.name, i));

    const opt: EChartsOption = {
      ...chartTheme,
      title: title ? { ...chartTheme.title, text: title } : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'item',
        formatter: (params: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = params as any;
          return `<div style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
            <span style="color:${tokens.text.secondary}">${p.name}</span>
            <span style="font-family:${FONT_DATA};font-weight:700;color:${tokens.text.strong};margin-left:8px">${p.percent}%</span>
          </div>`;
        },
      },
      legend: {
        ...chartTheme.legend,
        show: true,
        orient: 'vertical',
        right: '5%',
        top: 'middle',
      },
      series: [
        {
          type: 'pie',
          radius: ['0%', '75%'],
          center: ['40%', '50%'],
          label: showPercentLabel
            ? {
                show: true,
                position: 'inside',
                formatter: '{val|{d}%}',
                rich: {
                  val: {
                    fontFamily: FONT_DATA,
                    fontWeight: 700,
                    color: tokens.text.strong,
                    fontSize: 20,
                    lineHeight: 24,
                  },
                },
              }
            : { show: false },
          labelLine: { show: false },
          data: data.map((d, i) => {
            const color = getChartColor(i);
            return {
              name: d.name,
              value: d.value,
              itemStyle: { color: `${color}66` },
              label: showPercentLabel
                ? {
                    rich: {
                      val: {
                        fontFamily: FONT_DATA,
                        fontWeight: 700,
                        color: tokens.text.strong,
                        fontSize: getLabelFontSize(rankMap.get(d.name) ?? data.length),
                        lineHeight: getLabelFontSize(rankMap.get(d.name) ?? data.length) + 4,
                      },
                    },
                  }
                : undefined,
            };
          }),
          itemStyle: {
            borderColor: tokens.background.card,
            borderWidth: 2,
          },
        },
      ],
      ...optionOverrides,
    };
    return opt;
  }, [title, data, showPercentLabel, optionOverrides, chartTheme, getChartColor, tokens]);

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

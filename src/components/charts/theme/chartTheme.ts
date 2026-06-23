'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { useAppTheme } from '@/contexts';
import { defaultTheme, type AppTheme } from '@/themes';

const FONT_FAMILY = 'Inter, Roboto, "PingFang SC", sans-serif';
const FONT_DATA = '"DIN Alternate", "SF Mono", "Fira Code", Consolas, monospace';

function createChartRuntime(theme: AppTheme) {
  const { tokens } = theme;
  const chartColors = [...tokens.chart];
  const dualSeriesColors = [chartColors[0], tokens.text.strong] as const;

  const chartTheme: EChartsOption = {
    color: chartColors,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: FONT_FAMILY,
      color: tokens.text.secondary,
      fontSize: 14,
    },
    title: {
      textStyle: {
        color: tokens.text.regular,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: FONT_FAMILY,
      },
      subtextStyle: {
        color: tokens.text.secondary,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
      },
    },
    legend: {
      textStyle: {
        color: tokens.text.secondary,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
      },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      icon: 'circle',
      top: 8,
      right: 12,
    },
    tooltip: {
      borderWidth: 0,
      backgroundColor: tokens.background.card,
      borderRadius: 8,
      padding: [8, 12],
      textStyle: {
        color: tokens.text.secondary,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
      },
      extraCssText: 'box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent);',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 48,
      containLabel: true,
    },
  };

  const axisStyleX = {
    axisLine: { lineStyle: { color: tokens.border.divider } },
    axisTick: { lineStyle: { color: tokens.border.divider } },
    axisLabel: { color: tokens.text.secondary, fontSize: 14, fontFamily: FONT_FAMILY, margin: 16 },
    splitLine: { lineStyle: { color: tokens.border.divider, type: 'dashed' as const } },
  };

  const axisStyleY = {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: tokens.text.secondary, fontSize: 14, fontFamily: FONT_FAMILY },
    splitLine: { lineStyle: { color: tokens.border.divider, type: 'dashed' as const } },
  };

  const getChartColor = (index: number): string => chartColors[index % chartColors.length];

  const makeTooltipFormatter = (unit?: string) => {
    return (params: unknown) => {
      const list = Array.isArray(params) ? params : [params];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const first = list[0] as any;
      let html = `<div style="font-size:14px;color:${tokens.text.secondary};margin-bottom:4px">${first?.axisValueLabel ?? first?.name ?? ''}</div>`;
      for (const item of list) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = item as any;
        const val = typeof p.value === 'number' ? p.value.toLocaleString() : p.value;
        html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">`;
        html += `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>`;
        html += `<span style="color:${tokens.text.secondary}">${p.seriesName}</span>`;
        html += `<span style="font-family:${FONT_DATA};font-weight:700;color:${tokens.text.strong};margin-left:auto">${val}${unit ?? ''}</span>`;
        html += `</div>`;
      }
      return html;
    };
  };

  return {
    chartColors,
    dualSeriesColors,
    chartTheme,
    axisStyleX,
    axisStyleY,
    getChartColor,
    makeTooltipFormatter,
    tokens,
  };
}

const defaultChartRuntime = createChartRuntime(defaultTheme);

export const CHART_COLORS = defaultChartRuntime.chartColors;
export const DUAL_SERIES_COLORS = defaultChartRuntime.dualSeriesColors;
export const chartTheme = defaultChartRuntime.chartTheme;
export const axisStyleX = defaultChartRuntime.axisStyleX;
export const axisStyleY = defaultChartRuntime.axisStyleY;
export const getChartColor = defaultChartRuntime.getChartColor;
export const makeTooltipFormatter = defaultChartRuntime.makeTooltipFormatter;

export function useChartTheme() {
  const theme = useAppTheme();
  return useMemo(() => createChartRuntime(theme), [theme]);
}

'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import type { ECharts, EChartsOption } from 'echarts';
import { useAppTheme } from '@/contexts';

export interface ChartWordCloudProps {
  title?: string;
  words: { name: string; value: number }[];
  height?: number | string;
  shape?: string;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
}

function getWordColor(value: number, max: number, highlight: string, secondary: string): string {
  if (max === 0) return secondary;
  const ratio = value / max;
  if (ratio >= 0.3) return highlight;
  if (ratio >= 0.1) return secondary;
  return `${secondary}80`;
}

function getWordSize(value: number, max: number): number {
  if (max === 0) return 14;
  const ratio = value / max;
  if (ratio >= 0.8) return 26;
  if (ratio >= 0.5) return 20;
  if (ratio >= 0.3) return 18;
  if (ratio >= 0.1) return 16;
  return 14;
}

export function ChartWordCloud({
  title,
  words,
  height = 320,
  shape = 'circle',
  loading = false,
  className,
  optionOverrides,
}: ChartWordCloudProps) {
  const theme = useAppTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);
  const [ready, setReady] = useState(false);

  const initChart = useCallback(async () => {
    if (!containerRef.current) return;
    const echarts = await import('echarts');
    await import('echarts-wordcloud');

    if (chartRef.current) {
      chartRef.current.dispose();
    }
    const instance = echarts.init(containerRef.current);
    chartRef.current = instance;
    setReady(true);
  }, []);

  useEffect(() => {
    initChart();
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [initChart]);

  const option = useMemo<EChartsOption>(() => {
    const maxValue = words.reduce((m, w) => Math.max(m, w.value), 0);
    const opt: EChartsOption = {
      title: title
        ? {
            text: title,
            textStyle: { color: theme.tokens.text.regular, fontSize: 16, fontWeight: 500 },
          }
        : undefined,
      tooltip: {
        show: true,
        borderWidth: 0,
        backgroundColor: theme.tokens.background.card,
        borderRadius: 8,
        padding: [8, 12],
        textStyle: { color: theme.tokens.text.secondary, fontSize: 14 },
        extraCssText: 'box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent);',
      },
      series: [
        {
          type: 'wordCloud',
          shape,
          sizeRange: [14, 26],
          rotationRange: [0, 0],
          rotationStep: 0,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'Inter, Roboto, "PingFang SC", sans-serif',
            fontWeight: 500,
            color: (params: unknown) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const p = params as any;
              return getWordColor(p.value, maxValue, theme.tokens.brand.primary, theme.tokens.text.secondary);
            },
          },
          emphasis: {
            textStyle: {
              color: theme.tokens.brand.primary,
              fontWeight: 700,
            },
          },
          data: words.map((w) => ({
            name: w.name,
            value: w.value,
            textStyle: {
              fontSize: getWordSize(w.value, maxValue),
            },
          })),
        } as never,
      ],
      ...optionOverrides,
    };
    return opt;
  }, [title, words, shape, optionOverrides, theme]);

  useEffect(() => {
    if (!chartRef.current || !ready) return;
    chartRef.current.setOption(option, { notMerge: true });
  }, [option, ready]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (loading) {
      chart.showLoading('default', {
        text: '',
        color: theme.tokens.chart[0],
        maskColor: `${theme.tokens.background.primary}CC`,
      });
    } else {
      chart.hideLoading();
    }
  }, [loading, ready, theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !chartRef.current) return;
    const ro = new ResizeObserver(() => {
      chartRef.current?.resize({ animation: { duration: 200 } });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [ready]);

  return (
    <div
      className={className}
      style={{ position: 'relative', height, width: '100%' }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
          }}
        />
      )}
    </div>
  );
}

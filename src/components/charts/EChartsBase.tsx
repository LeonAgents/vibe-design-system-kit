'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts';
import type * as EChartsNamespace from 'echarts';
import { useAppTheme } from '@/contexts';

let echartsModule: typeof EChartsNamespace | null = null;

function getEcharts(): Promise<typeof EChartsNamespace> {
  if (echartsModule) return Promise.resolve(echartsModule);
  return import('echarts').then((mod) => {
    echartsModule = mod;
    return mod;
  });
}

export interface EChartsBaseProps {
  option: EChartsOption;
  height?: number | string;
  width?: number | string;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onEvents?: Record<string, (params: unknown) => void>;
  setOptionOpts?: SetOptionOpts;
}

export function EChartsBase({
  option,
  height = 320,
  width = '100%',
  loading = false,
  className,
  style,
  notMerge = true,
  lazyUpdate = false,
  onEvents,
  setOptionOpts,
}: EChartsBaseProps) {
  const theme = useAppTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);
  const [ready, setReady] = useState(false);

  const initChart = useCallback(async () => {
    if (!containerRef.current) return;
    const echarts = await getEcharts();

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

  useEffect(() => {
    if (!chartRef.current || !ready) return;
    chartRef.current.setOption(option, {
      notMerge,
      lazyUpdate,
      ...setOptionOpts,
    });
  }, [option, notMerge, lazyUpdate, setOptionOpts, ready]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !ready) return;
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
    const chart = chartRef.current;
    if (!chart || !onEvents) return;

    const bindEntries = Object.entries(onEvents);
    for (const [eventName, handler] of bindEntries) {
      chart.on(eventName, (params: unknown) => handler(params));
    }
    return () => {
      for (const [eventName] of bindEntries) {
        chart.off(eventName);
      }
    };
  }, [onEvents, ready]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !chartRef.current) return;

    const ro = new ResizeObserver(() => {
      chartRef.current?.resize({ animation: { duration: 200 } });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [ready]);

  const containerStyle: React.CSSProperties = {
    height,
    width,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
    />
  );
}

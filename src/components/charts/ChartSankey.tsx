'use client';

import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { EChartsBase } from './EChartsBase';
import { useChartTheme } from './theme/chartTheme';

export interface ChartSankeyProps {
  title?: string;
  nodes: { name: string }[];
  links: { source: string; target: string; value: number }[];
  height?: number | string;
  loading?: boolean;
  className?: string;
  optionOverrides?: EChartsOption;
  onEvents?: Record<string, (params: unknown) => void>;
}

export function ChartSankey({
  title,
  nodes,
  links,
  height = 320,
  loading = false,
  className,
  optionOverrides,
  onEvents,
}: ChartSankeyProps) {
  const { chartTheme, getChartColor, tokens } = useChartTheme();

  const option = useMemo<EChartsOption>(() => {
    const opt: EChartsOption = {
      ...chartTheme,
      title: title ? { ...chartTheme.title, text: title } : undefined,
      tooltip: {
        ...chartTheme.tooltip,
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'sankey',
          left: 12,
          right: 12,
          top: title ? 48 : 24,
          bottom: 24,
          nodeAlign: 'left',
          nodeWidth: 12,
          nodeGap: 16,
          layoutIterations: 48,
          draggable: false,
          emphasis: { focus: 'adjacency' },
          lineStyle: {
            color: 'source',
            opacity: 0.28,
            curveness: 0.62,
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: tokens.border.divider,
          },
          label: {
            color: tokens.text.regular,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 18,
          },
          labelLayout: {
            hideOverlap: true,
          },
          data: nodes.map((n, i) => ({
            name: n.name,
            itemStyle: {
              color: getChartColor(i),
              borderColor: i === 0 ? getChartColor(0) : tokens.border.divider,
            },
          })),
          links: links.map((l) => ({
            source: l.source,
            target: l.target,
            value: l.value,
          })),
        },
      ],
      ...optionOverrides,
    };
    return opt;
  }, [title, nodes, links, optionOverrides, chartTheme, getChartColor, tokens]);

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

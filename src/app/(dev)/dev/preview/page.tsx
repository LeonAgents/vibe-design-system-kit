'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Search,
  TrendingUp,
  AlertCircle,
  Settings,
  Download,
  Bell,
  Eye,
  Heart,
  ListFilter,
  User,
  X,
} from 'lucide-react';

/* ──── shadcn/ui ──── */
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

/* ──── shared 工具组件 ──── */
import Icon from '@/components/shared/Icon';
import { ChannelIcon, CHANNEL_BRAND_COLOR } from '@/components/shared/ChannelIcons';
import AnimatedNumber from '@/components/shared/AnimatedNumber';
import AnimatedProgress from '@/components/shared/AnimatedProgress';
import SegmentedSwitcher from '@/components/shared/SegmentedSwitcher';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import RefreshStatusBadge from '@/components/shared/RefreshStatusBadge';
import DataPagination from '@/components/shared/DataPagination';
import { EmptyState, type EmptyStateVariant } from '@/components/shared/EmptyState';
import { CommentMetricIcon, ShareMetricIcon } from '@/components/metrics/primitives/MetricIcons';
import { DetailSectionIcon } from '@/components/metrics/detail/DetailSectionIcon';

/* ──── shell（用于复刻业务导航预览） ──── */
import { Tooltip as RadixTooltip } from 'radix-ui';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/shell/BrandLogo';
import { DefaultUserAvatar } from '@/components/shell/DefaultUserAvatar';
import {
  SidebarExpandIcon,
  SidebarCollapseIcon,
} from '@/components/shell/SidebarToggleIcons';
import {
  navGroups,
  getNavItemsByGroup,
  type NavItem,
} from '@/lib/navigation';
import { useTenant } from '@/contexts/TenantContext';
import { themeList } from '@/themes';
import { cn } from '@/lib/utils';

/* ──── 图表（13 个） ──── */
import {
  ChartLine,
  ChartBar,
  ChartDonut,
  ChartRadar,
  ChartStackedArea,
  ChartMiniSparkline,
  ChartBubble,
  ChartFunnel,
  ChartSankey,
  ChartProportion,
  ChartFlow,
  EChartsBase,
  useChartTheme,
} from '@/components/charts';

/* ═══════════════════════════════════════════════════════════════════════
   设计 Token 静态数据
   ═══════════════════════════════════════════════════════════════════════ */

const CORE_COLORS: { name: string; hex: string; usage: string }[] = [
  { name: '--highlight', hex: 'var(--highlight)', usage: '品牌主色 / 主按钮 / 选中态' },
  { name: '--text-strong', hex: 'var(--text-strong)', usage: '标题 / KPI 数字' },
  { name: '--text-regular', hex: 'var(--text-regular)', usage: '正文 / 表格内容' },
  { name: '--text-secondary', hex: 'var(--text-secondary)', usage: '提示 / 表头 / 标签' },
  { name: '--text-disabled', hex: 'var(--text-disabled)', usage: '装饰文字 / 禁用态文字（text 用）' },
  { name: '--text-decorative', hex: 'var(--text-decorative)', usage: '未选中 Tab 灰底、浮起色块（bg 用）' },
  { name: '--border-divider', hex: 'var(--border-divider)', usage: '分割线 / 边框（靛灰）' },
  { name: '--bg-primary', hex: 'var(--bg-primary)', usage: '页面背景（中性灰白）' },
  { name: '--bg-secondary', hex: 'var(--bg-secondary)', usage: '表头背景（靛米）' },
];

const INDICATOR_COLORS = [
  { name: '--color-indicator-up', hex: 'var(--color-indicator-up)', usage: '指标上升 / 增长（红涨）' },
  { name: '--color-indicator-down', hex: 'var(--color-indicator-down)', usage: '指标下降 / 回落（绿跌）' },
];

const CHART_PALETTE: { name: string; hex: string; alias: string }[] = [
  { name: '--color-chart-1', hex: 'var(--color-chart-1)', alias: '靛蓝（brand）' },
  { name: '--color-chart-2', hex: 'var(--color-chart-2)', alias: '雪青' },
  { name: '--color-chart-3', hex: 'var(--color-chart-3)', alias: '钢蓝' },
  { name: '--color-chart-4', hex: 'var(--color-chart-4)', alias: '天蓝' },
  { name: '--color-chart-5', hex: 'var(--color-chart-5)', alias: '青瓷' },
  { name: '--color-chart-6', hex: 'var(--color-chart-6)', alias: '橄榄' },
  { name: '--color-chart-7', hex: 'var(--color-chart-7)', alias: '薄荷' },
  { name: '--color-chart-8', hex: 'var(--color-chart-8)', alias: '鸡冠黄' },
  { name: '--color-chart-9', hex: 'var(--color-chart-9)', alias: '陶土' },
  { name: '--color-chart-10', hex: 'var(--color-chart-10)', alias: '玫红' },
  { name: '--color-chart-11', hex: 'var(--color-chart-11)', alias: '紫' },
];

const RISK_COLORS = [
  { name: '--color-risk-high', bg: '#D1595D', text: '#FFFFFF', usage: '高风险' },
  { name: '--color-risk-medium', bg: '#D6A84A', text: '#FFFFFF', usage: '中风险' },
  { name: '--color-risk-low', bg: '#6F8FC2', text: '#FFFFFF', usage: '低风险' },
];

const SENTIMENT_COLORS = [
  { name: '--color-sentiment-positive', bg: '#4A9E63', text: '#4A9E63', usage: '正面' },
  { name: '--color-sentiment-neutral', bg: '#8B91A8', text: '#8B91A8', usage: '中性' },
  { name: '--color-sentiment-negative', bg: '#D1595D', text: '#D1595D', usage: '负面' },
];

const HIGHLIGHT_OPACITIES = [
  { opacity: '100%', usage: '按钮背景 / 选中状态' },
  { opacity: '20%', usage: '品牌强调标签背景' },
  { opacity: '10%', usage: '词云核心词背景' },
  { opacity: '5%', usage: '词云普通词背景' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 26, 32, 40] as const;
const FONT_WEIGHTS = [400, 500, 600, 700] as const;

/* ═══════════════════════════════════════════════════════════════════════
   图表 Mock 数据
   ═══════════════════════════════════════════════════════════════════════ */

const lineXData = ['02/27', '02/28', '03/01', '03/02', '03/03', '03/04', '03/05'];
const lineSeries: {
  name: string;
  data: (number | null)[];
  dashed?: boolean;
  color?: string;
}[] = [
  {
    name: '实际值',
    data: [51, 38, 36, 50, null, null, null],
  },
  {
    name: '实际值',
    dashed: true,
    data: [null, null, null, 50, 60, 70, 68],
  },
  {
    name: '预测值',
    data: [35, 55, 62, 50, 42, 50, 78],
  },
];

const barXData = ['抖音', '小红书', '微博', '知乎', 'B 站'];
const barSeries = [{ name: '数值', data: [4321, 3210, 2876, 1654, 1234] }];

const donutData = [
  { name: '正面', value: 60 },
  { name: '中性', value: 25 },
  { name: '负面', value: 15 },
];

const radarIndicators = [
  { name: '影响力', max: 100 },
  { name: '活跃度', max: 100 },
  { name: '专业度', max: 100 },
  { name: '原创度', max: 100 },
  { name: '互动率', max: 100 },
];
const radarSeries = [{ name: '系列 A', values: [82, 75, 90, 68, 88] }];

const stackedAreaSeries = [
  { name: '正面', data: [120, 132, 101, 134, 90] },
  { name: '中性', data: [220, 182, 191, 234, 290] },
  { name: '负面', data: [30, 42, 31, 34, 19] },
];

const bubbleSeries = [
  {
    name: '抖音',
    data: [
      [10, 20, 500],
      [15, 30, 800],
      [20, 10, 300],
    ] as [number, number, number][],
  },
  {
    name: '小红书',
    data: [
      [12, 25, 600],
      [18, 15, 400],
    ] as [number, number, number][],
  },
];

const funnelData = [
  { name: '访问', value: 10000 },
  { name: '注册', value: 6000 },
  { name: '付费', value: 2000 },
  { name: '复购', value: 800 },
];

const sankeyNodes = [
  { name: '搜索' },
  { name: '推荐' },
  { name: '详情页' },
  { name: '购买' },
];
const sankeyLinks = [
  { source: '搜索', target: '详情页', value: 500 },
  { source: '推荐', target: '详情页', value: 300 },
  { source: '详情页', target: '购买', value: 200 },
];

const proportionData = [
  { name: '品牌A', value: 45 },
  { name: '品牌B', value: 30 },
  { name: '品牌C', value: 25 },
];

const flowSteps = [
  { label: '数据采集', description: '多平台抓取' },
  { label: '数据清洗', description: '去重 / 归一化' },
  { label: '分析建模', description: 'AI 打分' },
  { label: '报告输出', description: '看板呈现' },
];

const sparklineData = [10, 23, 18, 35, 28, 40, 32];

const EMPTY_VARIANTS: EmptyStateVariant[] = [
  'no-search',
  'no-creation',
  'no-data',
  'processing',
  'error',
];

/* ═══════════════════════════════════════════════════════════════════════
   主页面
   ═══════════════════════════════════════════════════════════════════════ */

export default function PreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const [tab, setTab] = useState<'a' | 'b' | 'c'>('a');
  const [page, setPage] = useState(1);
  const { axisStyleX, axisStyleY, getChartColor } = useChartTheme();
  const { themeId, setThemeId } = useTenant();

  return (
    <TooltipProvider delayDuration={150}>
    <div
      style={{
        minHeight: '100vh',
        padding: '0 24px 96px',
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      {/* ─── 主题切换器（吸顶） ─── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          padding: '12px 0',
          background: 'color-mix(in srgb, var(--bg-primary) 88%, transparent)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-divider)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
          主题
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {themeList.map((theme) => {
            const active = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 'var(--radius-full)',
                  border: active
                    ? '1px solid var(--highlight)'
                    : '1px solid var(--border-divider)',
                  background: active ? 'var(--highlight-light)' : 'var(--bg-card)',
                  color: active ? 'var(--highlight)' : 'var(--text-regular)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: theme.tokens.brand.primary,
                    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--text-strong) 12%, transparent)',
                  }}
                />
                {theme.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 顶部 banner ─── */}
      <div
        style={{
          marginTop: 24,
          padding: '12px 16px',
          background: 'var(--highlight-light)',
          border: '1px solid var(--border-divider)',
          borderRadius: 8,
          fontSize: 14,
          color: 'var(--highlight)',
          fontWeight: 500,
          letterSpacing: '0.04em',
        }}
      >
        DEVELOPMENT PREVIEW · 仅开发环境可见 · 这是 DESIGN_SYSTEM.md 的实物呈现
      </div>

      {/* ─── 页面标题 ─── */}
      <header style={{ marginTop: 48, marginBottom: 48 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-strong)',
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          设计系统预览
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          按 <code style={codeChip}>DESIGN_SYSTEM.md</code> 章节顺序展示所有设计 token 与组件。
          权威源仍是文档；本页用于视觉对照与上手参考。
        </p>
      </header>

      {/* ═══ 色板 ═══ */}
      <Section id="colors" title="色板（Color Palette）" subtitle="所有色块通过 var(--xxx) 渲染，非硬编码 hex">
        <SubSection title="核心色">
          <ColorGrid items={CORE_COLORS} />
        </SubSection>
        <SubSection title="指标颜色">
          <ColorGrid items={INDICATOR_COLORS} />
        </SubSection>
        <SubSection title="图表配色（11 色序列）">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {CHART_PALETTE.map((c, idx) => (
              <ColorSwatch
                key={c.name}
                background={`var(${c.name})`}
                name={c.name}
                hex={c.hex}
                usage={`#${idx + 1} · ${c.alias}`}
              />
            ))}
          </div>
        </SubSection>
        <SubSection title="风险色">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {RISK_COLORS.map((c) => (
              <div
                key={c.name}
                style={{
                  background: `var(${c.name})`,
                  padding: 16,
                  borderRadius: 8,
                  border: '1px solid transparent',
                }}
              >
                <div style={{ fontSize: 14, fontFamily: 'var(--font-data)', color: c.text }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 14, color: c.text, marginTop: 4 }}>{c.usage}</div>
                <div style={{ fontSize: 12, color: c.text, marginTop: 8, opacity: 0.92 }}>
                  底色 {c.bg} · 文字 {c.text}
                </div>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="情绪色">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {SENTIMENT_COLORS.map((c) => (
              <div
                key={c.name}
                style={{
                  background: `color-mix(in srgb, var(${c.name}) 20%, transparent)`,
                  padding: 16,
                  borderRadius: 8,
                  border: '1px solid var(--border-divider)',
                }}
              >
                <div style={{ fontSize: 14, fontFamily: 'var(--font-data)', color: c.text }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 14, color: c.text, marginTop: 4 }}>{c.usage}</div>
                <div style={{ fontSize: 12, color: c.text, marginTop: 8, opacity: 0.92 }}>
                  背景 {c.bg} 20% · 文字 {c.text} 100%
                </div>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="主色透明度">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {HIGHLIGHT_OPACITIES.map((o) => {
              const isSolid = o.opacity === '100%';
              return (
                <div
                  key={o.opacity}
                  style={{
                    width: 200,
                    padding: 16,
                    background: `color-mix(in srgb, var(--highlight) ${o.opacity.replace('%', '')}%, transparent)`,
                    borderRadius: 8,
                    border: '1px solid var(--border-divider)',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: isSolid ? 'var(--highlight-foreground)' : 'var(--text-strong)' }}>{o.opacity}</div>
                  <div style={{ fontSize: 14, color: isSolid ? 'color-mix(in srgb, var(--highlight-foreground) 85%, transparent)' : 'var(--text-secondary)', marginTop: 4 }}>{o.usage}</div>
                </div>
              );
            })}
          </div>
        </SubSection>
      </Section>

      {/* ═══ 字号字重 ═══ */}
      <Section id="typography" title="字号 / 字重（Typography）" subtitle="仅允许白名单内的值">
        <SubSection title="字号（9 档）">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FONT_SIZES.map((size) => (
              <div
                key={size}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 24,
                  padding: '12px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    width: 48,
                    flexShrink: 0,
                  }}
                >
                  {size}px
                </span>
                <span style={{ fontSize: size, color: 'var(--text-strong)' }}>
                  数据驱动 Data-Driven 1234567890
                </span>
                {size === 12 && (
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    只在标签中展示，其余不能用
                  </span>
                )}
                {size === 14 && (
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    正文，最小字号，兜底字号
                  </span>
                )}
                {size === 16 && (
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    小型卡片标题（加粗）、昵称（加粗）、文章标题（加粗）、弹窗标题（加粗）
                  </span>
                )}
                {size === 18 && (
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    抽屉标题（加粗）、大卡片标题（加粗）
                  </span>
                )}
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="字重（4 档）">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FONT_WEIGHTS.map((weight) => (
              <div
                key={weight}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 24,
                  padding: '12px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    width: 48,
                    flexShrink: 0,
                  }}
                >
                  {weight}
                </span>
                <span style={{ fontSize: 14, fontWeight: weight, color: 'var(--text-strong)' }}>
                  字重 {weight} · The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="数据字体（DIN Alternate）">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            <DataDisplayCard label="KPI 大字 · 40px / 700" size={40} value="12,847" />
            <DataDisplayCard label="指标中字 · 18px / 700" size={18} value="+24.3%" />
            <DataDisplayCard label="辅助小字 · 16px / 700" size={16} value="8.3 min" />
          </div>
        </SubSection>
      </Section>

      {/* ═══ shadcn/ui 组件 ═══ */}
      <Section id="shadcn" title="shadcn/ui 基础组件" subtitle="所有交互组件可点击触发">
        <SubSection title="Button（variant × size）">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button size="xs">xs</Button>
              <Button size="sm">sm</Button>
              <Button size="default">default</Button>
              <Button size="lg">lg</Button>
              <Button size="icon">
                <Search />
              </Button>
            </div>
          </div>
        </SubSection>
        <SubSection title="Badge（variant）">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </SubSection>
        <SubSection title="Input / Label / Skeleton / Separator / Progress">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <div>
              <Label htmlFor="demo-input" style={{ display: 'block', marginBottom: 8 }}>
                输入框
              </Label>
              <Input id="demo-input" placeholder="请输入关键词..." />
            </div>
            <div>
              <Label style={{ display: 'block', marginBottom: 8 }}>Skeleton 占位</Label>
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <Skeleton style={{ height: 16, marginBottom: 8 }} />
                  <Skeleton style={{ height: 16, width: '70%' }} />
                </div>
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Label style={{ display: 'block', marginBottom: 8 }}>Progress（shadcn 原生）</Label>
              <Progress value={62} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Label style={{ display: 'block', marginBottom: 8 }}>Separator</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>左</span>
                <Separator orientation="vertical" style={{ height: 20 }} />
                <span>中</span>
                <Separator orientation="vertical" style={{ height: 20 }} />
                <span>右</span>
              </div>
            </div>
          </div>
        </SubSection>
        <SubSection title="Select / Tooltip">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ minWidth: 200 }}>
              <Label style={{ display: 'block', marginBottom: 8 }}>下拉选择</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">最近 7 天</SelectItem>
                  <SelectItem value="30d">最近 30 天</SelectItem>
                  <SelectItem value="90d">最近 90 天</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover 显示 Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>这是 Tooltip 内容</TooltipContent>
            </Tooltip>
          </div>
        </SubSection>
        <SubSection title="Dialog / Popover / DropdownMenu / Sheet（点击触发）">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">打开 Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog 标题</DialogTitle>
                  <DialogDescription>
                    这是一段 Dialog 描述文本，演示模态对话框的标准结构。
                  </DialogDescription>
                </DialogHeader>
                <div style={{ marginTop: 16, fontSize: 14, color: 'var(--text-regular)' }}>
                  Dialog 内容区域可放任意 React 节点。按 ESC 或点击遮罩可关闭。
                </div>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">打开 Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div style={{ fontSize: 14, color: 'var(--text-regular)' }}>
                  Popover 用于浮层菜单 / 详情卡。
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">DropdownMenu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Settings style={{ width: 14, height: 14, marginRight: 8 }} />
                  设置
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download style={{ width: 14, height: 14, marginRight: 8 }} />
                  导出
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertCircle style={{ width: 14, height: 14, marginRight: 8 }} />
                  报告问题
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">打开 Sheet（侧滑）</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet 标题</SheetTitle>
                </SheetHeader>
                <div style={{ padding: '16px 24px', fontSize: 14, color: 'var(--text-regular)' }}>
                  Sheet 通常用作右侧抽屉，承载详情或编辑表单。
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </SubSection>
      </Section>

      {/* ═══ shared 工具组件 ═══ */}
      <Section id="shared" title="共享工具组件（src/components/shared/）">
        <SubSection title="Icon · lucide-react 包装器（统一 20×20 容器 + stroke 1.3）">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <IconDemo label="搜索" icon={<Icon icon={Search} />} />
            <IconDemo label="趋势" icon={<Icon icon={TrendingUp} color="var(--highlight)" />} />
            <IconDemo label="警示" icon={<Icon icon={AlertCircle} color="var(--color-risk-high)" />} />
            <IconDemo label="设置" icon={<Icon icon={Settings} />} />
            <IconDemo label="自定义 24" icon={<Icon icon={Download} size={20} />} />
          </div>
        </SubSection>
        <SubSection title="ChannelIcons · 20 个社媒平台 LOGO">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
            {Object.keys(CHANNEL_BRAND_COLOR).map((channel) => (
              <div
                key={channel}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 8,
                  gap: 8,
                }}
              >
                <ChannelIcon channel={channel} size={32} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{channel}</span>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="DefaultAvatars · 默认头像">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
            {['默认头像'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 8,
                  gap: 8,
                }}
              >
                <DefaultUserAvatar size={28} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="AnimatedNumber · AnimatedProgress">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <Card>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                总用户数
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 40,
                  fontWeight: 700,
                  color: 'var(--text-strong)',
                }}
              >
                <AnimatedNumber value={12847} />
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                完成度
              </div>
              <AnimatedProgress value={75} />
              <div
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-strong)',
                  marginTop: 8,
                }}
              >
                75%
              </div>
            </Card>
          </div>
        </SubSection>
        <SubSection title="SegmentedSwitcher · 分段控件（pill 变体）">
          <SegmentedSwitcher
            value={tab}
            onChange={setTab}
            items={[
              { key: 'a', label: '实时数据' },
              { key: 'b', label: '对标分析' },
              { key: 'c', label: '变化趋势' },
            ]}
          />
        </SubSection>
        <SubSection title="InfoTooltip · 帮助提示">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-regular)' }}>转化率</span>
            <InfoTooltip description="转化率 = 完成订单数 / 访问总数 × 100%" />
          </div>
        </SubSection>
        <SubSection title="RefreshStatusBadge · 数据刷新状态">
          <RefreshStatusBadge intervalMs={300_000} onRefresh={() => {}} />
        </SubSection>
        <SubSection title="DataPagination · 列表分页">
          <DataPagination total={87} pageSize={10} currentPage={page} onChange={setPage} />
        </SubSection>
      </Section>

      {/* ═══ 业务组件规范 ═══ */}
      <Section id="business-components" title="业务组件规范（洞察平台）" subtitle="导航、筛选、卡片、详情页模块、指标、浮层和状态组件">
        <SubSection title="导航与应用框架">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'start' }}>
            <BusinessSideNavPreview />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <BusinessTopBarPreview />
              <BusinessBreadcrumbPreview />
            </div>
          </div>
        </SubSection>

        <SubSection title="筛选与查询控件">
          <BusinessFilterPreview />
        </SubSection>

        <SubSection title="卡片层级规范（圆角 / 间距 / 背景 / 投影）">
          <BusinessCardSpecPreview />
        </SubSection>

        <SubSection title="监控卡片与指标展示">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
            <BusinessMentionCardPreview />
            <BusinessCommentCardPreview />
          </div>
        </SubSection>

        <SubSection title="详情页模块">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 16, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <BusinessSummaryCardPreview />
              <BusinessInsightPreview />
              <BusinessTimelinePreview />
            </div>
            <BusinessSidePanelPreview />
          </div>
        </SubSection>

        <SubSection title="侧边抽屉（高级筛选）">
          <BusinessFilterDrawerPreview />
        </SubSection>

        <SubSection title="浮层与状态">
          <BusinessOverlayStatePreview />
        </SubSection>
      </Section>

      {/* ═══ 图表 ═══ */}
      <Section id="charts" title="图表组件库（@/components/charts）" subtitle="13 个组件全展示，使用 inline mock 数据">
        <SubSection title="ChartLine · 折线图">
          <ChartContainer>
            <ChartLine
              xData={lineXData}
              series={lineSeries}
              unit="万"
            />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartBar · 柱状图">
          <ChartContainer>
            <ChartBar xData={barXData} series={barSeries} horizontal unit="篇" />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartDonut · 环形图">
          <ChartContainer>
            <ChartDonut data={donutData} centerText="60%" />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartRadar · 雷达图">
          <ChartContainer>
            <ChartRadar indicators={radarIndicators} series={radarSeries} />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartWordCloud · 词云图">
          <WordCloudReferenceSVG />
        </SubSection>
        <SubSection title="ChartStackedArea · 堆叠面积图">
          <ChartContainer>
            <ChartStackedArea
              xData={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
              series={stackedAreaSeries}
            />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartMiniSparkline · 迷你趋势线（嵌入用）">
          <div
            style={{
              padding: 16,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-divider)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>互动量</span>
            <ChartMiniSparkline data={sparklineData} />
            <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, color: 'var(--text-strong)' }}>
              +32%
            </span>
          </div>
        </SubSection>
        <SubSection title="ChartBubble · 气泡图">
          <ChartContainer>
            <ChartBubble series={bubbleSeries} />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartFunnel · 漏斗图">
          <ChartContainer>
            <ChartFunnel data={funnelData} />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartSankey · 桑基图">
          <ChartContainer>
            <ChartSankey nodes={sankeyNodes} links={sankeyLinks} />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartProportion · 占比图（大号百分比）">
          <ChartContainer>
            <ChartProportion data={proportionData} />
          </ChartContainer>
        </SubSection>
        <SubSection title="ChartFlow · 流程图（纯 React，非 ECharts）">
          <div
            style={{
              padding: 16,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-divider)',
              borderRadius: 8,
            }}
          >
            <ChartFlow steps={flowSteps} />
          </div>
        </SubSection>
        <SubSection title="EChartsBase · 底层基座（仅在预设组件不满足时使用）">
          <ChartContainer>
            <EChartsBase
              option={{
                xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'], ...axisStyleX },
                yAxis: { type: 'value', ...axisStyleY },
                series: [
                  {
                    type: 'bar',
                    barWidth: 40,
                    data: [120, 200, 150, 80],
                    itemStyle: { color: getChartColor(0), borderRadius: [8, 8, 0, 0] },
                  },
                ],
                grid: { left: 40, right: 20, top: 20, bottom: 30, containLabel: true },
              }}
              height={240}
            />
          </ChartContainer>
        </SubSection>
      </Section>

      {/* ═══ EmptyState ═══ */}
      <Section id="empty-state" title="空状态（EmptyState）" subtitle="5 variants × 2 sizes = 10 cells">
        <SubSection title="standard size · 400×280px">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {EMPTY_VARIANTS.map((v) => (
              <EmptyCell key={v} variant={v} size="standard" />
            ))}
          </div>
        </SubSection>
        <SubSection title="compact size · 200×130px">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {EMPTY_VARIANTS.map((v) => (
              <EmptyCell key={v} variant={v} size="compact" />
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ═══ 动画 utilities ═══ */}
      <Section id="motion" title="动画 / 交互（globals.css utilities）">
        <SubSection title=".hover-lift · 卡片悬浮上抬">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="hover-lift"
                style={{
                  padding: 24,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: 'var(--text-regular)',
                }}
              >
                Hover Card #{i}
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title=".animate-fade-in / .animate-slide-up · 入场">
          <div style={{ display: 'flex', gap: 16 }}>
            <div
              className="animate-fade-in"
              style={{
                padding: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-divider)',
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              fade-in
            </div>
            <div
              className="animate-slide-up"
              style={{
                padding: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-divider)',
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              slide-up
            </div>
          </div>
        </SubSection>
        <SubSection title="按钮按压反馈 · scale(0.97)">
          <div style={{ display: 'flex', gap: 12 }}>
            <Button>点击体验按压</Button>
            <Button variant="outline">点击体验按压</Button>
          </div>
        </SubSection>
        <SubSection title="Input focus ring · 主色光晕">
          <Input placeholder="点这里查看 focus 光晕" style={{ maxWidth: 320 }} />
        </SubSection>
      </Section>
    </div>
    </TooltipProvider>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   局部小组件（仅 preview 页使用）
   ═══════════════════════════════════════════════════════════════════════ */

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-section={id}
      style={{
        marginBottom: 96,
        scrollMarginTop: 24,
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text-strong)',
            marginBottom: 8,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{subtitle}</p>
        )}
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-strong)',
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function ColorGrid({ items }: { items: { name: string; hex: string; usage: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
      {items.map((c) => (
        <ColorSwatch key={c.name} background={`var(${c.name})`} name={c.name} hex={c.hex} usage={c.usage} />
      ))}
    </div>
  );
}

function ColorSwatch({
  background,
  name,
  hex,
  usage,
}: {
  background: string;
  name: string;
  hex: string;
  usage: string;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ background, height: 64 }} />
      <div style={{ padding: 12 }}>
        <div
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 14,
            color: 'var(--text-strong)',
            fontWeight: 500,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            marginTop: 4,
          }}
        >
          {hex}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{usage}</div>
      </div>
    </div>
  );
}

function DataDisplayCard({
  label,
  size,
  value,
}: {
  label: string;
  size: 16 | 18 | 40;
  value: string;
}) {
  return (
    <Card>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-data)',
          fontSize: size,
          fontWeight: 700,
          color: 'var(--text-strong)',
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 8,
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}

const PREVIEW_SIDENAV_TENANT = '示例控制台';
const PREVIEW_SIDENAV_USER = '示例用户';
const PREVIEW_SIDENAV_UNREAD = 3;
const PREVIEW_SIDENAV_EXPANDED = 208;
const PREVIEW_SIDENAV_COLLAPSED = 56;
const PREVIEW_SIDENAV_HEIGHT = 600;

function PreviewSideNav({
  collapsed,
  onToggle,
  activeKey,
  onActive,
}: {
  collapsed: boolean;
  onToggle: () => void;
  activeKey: string;
  onActive: (key: string) => void;
}) {
  const width = collapsed ? PREVIEW_SIDENAV_COLLAPSED : PREVIEW_SIDENAV_EXPANDED;

  return (
    <aside
      className="flex shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-divider)] bg-[var(--bg-primary)] transition-[width] duration-200"
      style={{ width, height: PREVIEW_SIDENAV_HEIGHT }}
      aria-label="主导航预览"
    >
      {collapsed ? (
        <div className="group/brand flex items-center justify-center px-3 pt-6 pb-3">
          <span
            className="flex size-7 items-center justify-center rounded-md outline-none group-hover/brand:hidden"
            aria-label={PREVIEW_SIDENAV_TENANT}
          >
            <BrandLogo size={28} title={PREVIEW_SIDENAV_TENANT} />
          </span>
          <button
            type="button"
            onClick={onToggle}
            aria-label="展开侧边栏"
            title="展开侧边栏"
            className="hidden size-7 items-center justify-center rounded-md text-[var(--text-strong)] outline-none transition-opacity hover:opacity-80 group-hover/brand:flex"
          >
            <SidebarExpandIcon />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 pt-5 pb-3">
          <span
            className="flex min-w-0 flex-1 items-center gap-2 outline-none"
            aria-label={PREVIEW_SIDENAV_TENANT}
          >
            <BrandLogo size={28} title={PREVIEW_SIDENAV_TENANT} />
            <span className="flex min-w-0 flex-col justify-center leading-none">
              <span className="text-sm font-bold leading-4 text-[var(--text-strong)]">
                Vibe
              </span>
              <span className="mt-0.5 whitespace-nowrap text-xs leading-4 text-[var(--text-secondary)]">
                {PREVIEW_SIDENAV_TENANT}
              </span>
            </span>
          </span>
          <button
            type="button"
            onClick={onToggle}
            aria-label="收起侧边栏"
            title="收起侧边栏"
            className="flex size-7 shrink-0 items-center justify-center rounded text-[var(--text-strong)] outline-none transition-opacity hover:bg-[var(--border-divider)] hover:opacity-80"
          >
            <SidebarCollapseIcon />
          </button>
        </div>
      )}

      <nav
        className={cn(
          'flex-1 overflow-y-auto px-2',
          collapsed ? 'space-y-1 pt-3' : 'space-y-5 pt-5',
        )}
      >
        {navGroups.map((group) => {
          const items = getNavItemsByGroup(group.key);
          if (items.length === 0) return null;
          return (
            <div key={group.key}>
              {!collapsed && (
                <div className="mb-3 pl-[11px] pr-2 text-sm leading-5 text-[var(--text-secondary)]">
                  {group.label}
                </div>
              )}
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.key}>
                    <PreviewNavMenuItem
                      item={item}
                      collapsed={collapsed}
                      active={activeKey === item.key}
                      onClick={() => {
                        if (item.status !== 'comingSoon') onActive(item.key);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="space-y-2 px-2 pt-2 pb-6">
          <button
            type="button"
            className="group flex h-9 w-full items-center gap-2 rounded-lg pl-[11px] pr-2 text-sm text-[var(--text-regular)] outline-none transition-colors hover:bg-[color-mix(in_srgb,var(--border-divider)_40%,transparent)] hover:text-[var(--text-strong)]"
          >
            <Bell className="size-[18px] shrink-0" strokeWidth={1.5} />
            <span className="flex-1 truncate text-left">系统消息</span>
            {PREVIEW_SIDENAV_UNREAD > 0 && (
              <span
                className="inline-flex h-4 items-center rounded-full px-1.5 text-xs font-medium leading-none text-white"
                style={{ background: 'var(--color-notification-badge)' }}
              >
                {PREVIEW_SIDENAV_UNREAD > 99 ? '99+' : PREVIEW_SIDENAV_UNREAD}
              </span>
            )}
          </button>
          <button
            type="button"
            className="flex h-10 w-full items-center gap-2 rounded-lg pl-[7px] pr-2 text-sm text-[var(--text-regular)] outline-none"
          >
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="bg-transparent p-0">
                <DefaultUserAvatar size={28} />
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-left">{PREVIEW_SIDENAV_USER}</span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded text-[var(--text-secondary)] transition-opacity hover:bg-[var(--border-divider)] hover:opacity-80">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M0.943333 0L4 3.05667L7.05667 0L8 0.943333L4 4.94333L0 0.943333L0.943333 0Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  transform="matrix(0,-1,1,0,5.47339,12)"
                />
              </svg>
            </span>
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-4 px-2 pt-2 pb-6"
          onDoubleClick={onToggle}
          title="双击展开"
        >
          <RadixTooltip.Root delayDuration={120}>
            <RadixTooltip.Trigger asChild>
              <button
                type="button"
                aria-label={`通知, ${PREVIEW_SIDENAV_UNREAD} 条未读`}
                className="relative flex size-7 items-center justify-center rounded-md text-[var(--text-strong)] transition-colors hover:bg-[var(--bg-secondary)]"
              >
                <Bell className="size-[18px]" strokeWidth={1.5} />
                {PREVIEW_SIDENAV_UNREAD > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 inline-flex size-2 rounded-full ring-2 ring-[var(--bg-primary)]"
                    style={{ background: 'var(--highlight)' }}
                    aria-hidden
                  />
                )}
              </button>
            </RadixTooltip.Trigger>
            <RadixTooltip.Portal>
              <RadixTooltip.Content
                side="right"
                sideOffset={8}
                className="z-50 rounded-md bg-[var(--text-strong)] px-2 py-1 text-sm text-white shadow-md"
              >
                通知 · {PREVIEW_SIDENAV_UNREAD} 条未读
                <RadixTooltip.Arrow className="fill-[var(--text-strong)]" />
              </RadixTooltip.Content>
            </RadixTooltip.Portal>
          </RadixTooltip.Root>

          <RadixTooltip.Root delayDuration={120}>
            <RadixTooltip.Trigger asChild>
              <button
                type="button"
                aria-label={`当前用户 ${PREVIEW_SIDENAV_USER}`}
                className="flex size-7 items-center justify-center rounded-full outline-none"
              >
                <Avatar className="size-7">
                  <AvatarFallback className="bg-transparent p-0">
                    <DefaultUserAvatar size={28} />
                  </AvatarFallback>
                </Avatar>
              </button>
            </RadixTooltip.Trigger>
            <RadixTooltip.Portal>
              <RadixTooltip.Content
                side="right"
                sideOffset={8}
                className="z-50 rounded-md bg-[var(--text-strong)] px-2 py-1 text-sm text-white shadow-md"
              >
                {PREVIEW_SIDENAV_USER}
                <RadixTooltip.Arrow className="fill-[var(--text-strong)]" />
              </RadixTooltip.Content>
            </RadixTooltip.Portal>
          </RadixTooltip.Root>
        </div>
      )}
    </aside>
  );
}

function PreviewNavMenuItem({
  item,
  collapsed,
  active,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const ItemIcon = item.icon;
  const isComingSoon = item.status === 'comingSoon';

  const inner = collapsed ? (
    <span
      className={cn(
        'group flex size-10 items-center justify-center',
        isComingSoon && 'pointer-events-none cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-md transition-colors',
          active
            ? 'bg-[var(--highlight)] text-white'
            : 'text-[var(--text-strong)] group-hover:bg-[var(--border-divider)]',
          isComingSoon && 'text-[var(--text-disabled)] group-hover:bg-transparent',
        )}
      >
        <ItemIcon className="size-[18px] shrink-0" strokeWidth={1.5} />
      </span>
    </span>
  ) : (
    <span
      className={cn(
        'group flex h-10 items-center gap-2 rounded-lg pl-[11px] pr-2 text-sm transition-colors',
        active
          ? 'bg-[var(--highlight)] text-white'
          : 'text-[var(--text-regular)] hover:bg-[color-mix(in_srgb,var(--border-divider)_40%,transparent)] hover:text-[var(--text-strong)]',
        isComingSoon &&
          'pointer-events-none cursor-not-allowed text-[var(--text-disabled)] hover:bg-transparent hover:text-[var(--text-disabled)]',
      )}
    >
      <ItemIcon className="size-[18px] shrink-0" strokeWidth={1.5} />
      <span className="flex-1 truncate text-left">{item.label}</span>
      {isComingSoon && (
        <span className="rounded-sm bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs leading-none text-[var(--text-secondary)]">
          即将上线
        </span>
      )}
    </span>
  );

  const trigger = (
    <button
      type="button"
      onClick={isComingSoon ? undefined : onClick}
      aria-disabled={isComingSoon || undefined}
      className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left outline-none aria-disabled:cursor-not-allowed"
    >
      {inner}
    </button>
  );

  const tooltipText = collapsed
    ? isComingSoon
      ? `${item.label} · 即将上线`
      : item.label
    : isComingSoon
      ? '即将上线'
      : '';

  if (!tooltipText) return trigger;

  return (
    <RadixTooltip.Root delayDuration={120}>
      <RadixTooltip.Trigger asChild>{trigger}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="right"
          sideOffset={8}
          className="z-50 rounded-md bg-[var(--text-strong)] px-2 py-1 text-sm text-white shadow-md"
        >
          {tooltipText}
          <RadixTooltip.Arrow className="fill-[var(--text-strong)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

function BusinessSideNavPreview() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('mentions');

  return (
    <RadixTooltip.Provider delayDuration={200}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {collapsed ? '收起态 · 56px（双击底部空白展开）' : '展开态 · 208px'}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            style={{
              height: 28,
              padding: '0 12px',
              borderRadius: 6,
              border: '1px solid var(--border-divider)',
              background: 'var(--bg-card)',
              color: 'var(--text-regular)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            切换为{collapsed ? '展开' : '收起'}
          </button>
        </div>
        <PreviewSideNav
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          activeKey={activeKey}
          onActive={setActiveKey}
        />
      </div>
    </RadixTooltip.Provider>
  );
}

function BusinessTopBarPreview() {
  return (
    <div
      style={{
        minHeight: 208,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>
            实时概览
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '8px 0 0' }}>
            以条目为中心，跟踪相关内容、高赞评论与处理状态。
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" style={iconButtonStyle} aria-label="通知">
            <Bell size={16} strokeWidth={1.75} />
          </button>
          <button type="button" style={iconButtonStyle} aria-label="用户">
            <User size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16 }}>
        <div
          style={{
            borderRadius: 16,
            border: '1px solid var(--border-divider)',
            background: 'var(--bg-primary)',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>
              重点概览
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>近 24h</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['高互动', '热度上升', '重点内容'].map((label) => (
              <span key={label} style={topicTagStyle}>{label}</span>
            ))}
          </div>
        </div>
        <div
          style={{
            borderRadius: 16,
            border: '1px solid var(--border-divider)',
            background: 'var(--bg-primary)',
            padding: 16,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>
            待办分组
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['全部', '高优先', '重点', '未处理'].map((label, index) => (
              <span
                key={label}
                style={{
                  display: 'inline-flex',
                  height: 32,
                  alignItems: 'center',
                  borderRadius: 6,
                  background: index === 0 ? 'var(--highlight)' : 'var(--bg-card)',
                  border: index === 0 ? '1px solid var(--highlight)' : '1px solid var(--border-divider)',
                  color: index === 0 ? 'var(--bg-card)' : 'var(--text-regular)',
                  padding: '0 12px',
                  fontSize: 14,
                  fontWeight: index === 0 ? 700 : 500,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessBreadcrumbPreview() {
  return (
    <div
      style={{
        minHeight: 48,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 16,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        color: 'var(--text-secondary)',
      }}
    >
      <span style={{ color: 'var(--text-strong)', fontWeight: 500 }}>列表首页不展示面包屑</span>
      <span>PageHeader 使用 showBreadcrumb=false，详情页再恢复路径提示。</span>
    </div>
  );
}

function BusinessFilterPreview() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Select defaultValue="24h">
          <SelectTrigger className="w-[208px] bg-[var(--bg-control)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">今日</SelectItem>
            <SelectItem value="24h">近 24h</SelectItem>
            <SelectItem value="7d">近 7 天</SelectItem>
            <SelectItem value="30d">近 30 天</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[208px] bg-[var(--bg-control)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部情感</SelectItem>
            <SelectItem value="positive">正面</SelectItem>
            <SelectItem value="neutral">中性</SelectItem>
            <SelectItem value="negative">负面</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[208px] bg-[var(--bg-control)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">未处理</SelectItem>
            <SelectItem value="viewed">已查看</SelectItem>
            <SelectItem value="handled">已处理</SelectItem>
            <SelectItem value="ignored">已忽略</SelectItem>
            <SelectItem value="false_positive">误判</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          style={{
            height: 40,
            width: 280,
            borderRadius: 8,
            border: '1px solid var(--border-divider)',
            background: 'var(--bg-control)',
            color: 'var(--text-regular)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <span style={{ padding: '0 4px' }}>高级筛选</span>
          <ListFilter size={16} strokeWidth={1.75} />
        </button>
        <div style={{ position: 'relative', width: 280 }}>
          <Input
            className="h-10 bg-[var(--bg-card-hover)] pr-9 pl-3 placeholder:text-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)]"
            placeholder="搜索标题、正文、账号"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          高级筛选选中后展示为：
        </span>
        <span style={filterChipStyle}>抖音</span>
        <span style={filterChipStyle}>价格</span>
        <span style={filterChipStyle}>互动≥1000</span>
        <span style={filterChipStyle}>+2</span>
      </div>
    </div>
  );
}

function BusinessMentionCardPreview() {
  return (
    <div style={businessCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={avatarStyle}>硬</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>
                @数据观察员
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>
                抖音 · 2 小时前
              </div>
            </div>
          </div>
          <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>
            Vibe 新版方案曝光，核心用户讨论升温
          </h4>
          <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text-regular)', margin: '8px 0 0' }}>
            重点关注价格预期、配置与体验反馈，当前讨论热度持续上升。
          </p>
        </div>
        <span style={sentimentTagStyle}>负面</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {['#外观', '#价格', '#体验'].map((tag) => (
          <span key={tag} style={topicTagStyle}>{tag}</span>
        ))}
      </div>
      <MetricRowPreview />
    </div>
  );
}

function BusinessCommentCardPreview() {
  return (
    <div style={businessCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={avatarStyle}>评</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>
                核心用户 42
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>
                来自原帖 · 42 分钟前
              </div>
            </div>
          </div>
          <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>
            来自 @数据观察员：外观曝光讨论
          </h4>
          <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text-regular)', margin: '8px 0 0' }}>
            如果价格超过预期，老用户可能不会买账。
          </p>
        </div>
        <span style={riskTagStyle}>高风险</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {['#评论', '#价格', '#用户'].map((tag) => (
          <span key={tag} style={topicTagStyle}>{tag}</span>
        ))}
      </div>
      <MetricRowPreview />
    </div>
  );
}

function MetricRowPreview() {
  const metrics = [
    { label: '阅读', value: '12.8万', icon: Eye },
    { label: '点赞', value: '2,431', icon: Heart },
    { label: '评论', value: '386', icon: CommentMetricIcon },
    { label: '转发', value: '91', icon: ShareMetricIcon },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid var(--border-divider)',
      }}
    >
      {metrics.map(({ label, value, icon: IconComponent }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <span
              style={{
                display: 'inline-flex',
                height: 22,
                alignItems: 'center',
                gap: 8,
                color: 'var(--text-secondary)',
                fontSize: 14,
              }}
            >
              <IconComponent width={18} height={18} strokeWidth={1.75} />
              <span style={{ color: 'var(--text-strong)', fontSize: 14 }}>{value}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function BusinessSummaryCardPreview() {
  return (
    <div style={businessCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DetailSectionIcon variant="highlight" />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>
            首屏判断摘要
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={riskTagStyle}>高风险</span>
          <span style={sentimentTagStyle}>负面</span>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: '22px', color: 'var(--text-regular)', margin: '16px 0 0' }}>
        用户集中讨论核心要点与可靠性，建议优先关注高互动评论与重点反馈。
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {['#价格', '#外观', '#体验'].map((tag) => (
          <span key={tag} style={topicTagStyle}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function BusinessInsightPreview() {
  return (
    <div style={businessCardStyle}>
      <SectionTitlePreview title="AI 判断详情" subtitle="立场、实体与处理线索" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <InfoBlockPreview label="立场" value="质疑价格" />
        <InfoBlockPreview label="相关度" value="86%" progress={86} />
        <InfoBlockPreview label="提到实体" value="实体 · 示例产品" />
      </div>
    </div>
  );
}

function BusinessTimelinePreview() {
  const items = ['首发内容带动讨论', '价格争议进入评论区', '重点评论被多次转发'];

  return (
    <div style={businessCardStyle}>
      <SectionTitlePreview title="整体趋势" subtitle="趋势图 + 叙事时间线" />
      <div
        style={{
          height: 96,
          borderRadius: 8,
          background: 'color-mix(in srgb, var(--highlight) 5%, transparent)',
          border: '1px solid color-mix(in srgb, var(--highlight) 10%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        趋势图区域：当前互动 12.8万
      </div>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, index) => (
          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                display: 'inline-flex',
                width: 24,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                background: 'var(--highlight-light)',
                color: 'var(--highlight)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {index + 1}
            </span>
            <span style={{ flex: 1, borderRadius: 8, background: 'var(--bg-primary)', padding: '10px 12px', fontSize: 14, color: 'var(--text-regular)' }}>
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BusinessSidePanelPreview() {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 16,
      }}
    >
      <SidePanelBlock title="账号与来源">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={avatarStyle}>硬</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' }}>
              @数据观察员
            </div>
            <span style={{ ...topicTagStyle, marginTop: 4 }}>抖音</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
          <InfoBlockPreview label="粉丝规模" value="128.0万" compact />
          <InfoBlockPreview label="发布时间" value="2 小时前" compact />
        </div>
      </SidePanelBlock>
      <SidePanelBlock title="处理建议" divided>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
          <KeyValuePreview label="当前状态" value="已查看" />
          <KeyValuePreview label="负面评论" value="0" />
          <KeyValuePreview label="建议动作" value="持续观察" />
        </div>
        <div style={emptyNoticeStyle}>暂无处理建议，可结合整体态势继续观察。</div>
      </SidePanelBlock>
      <SidePanelBlock title="元数据" divided>
        <KeyValuePreview label="来源 URL" value="example.com/post" />
        <KeyValuePreview label="采集时间" value="2026-05-15 17:15" />
      </SidePanelBlock>
    </div>
  );
}

function BusinessCardSpecPreview() {
  const radiusSpecs = [
    { label: '主卡片', value: '16px', sample: 16, note: '监控卡片 / 摘要卡 / 右侧栏' },
    { label: '内容块 / 列表项', value: '8px', sample: 8, note: 'p-3 信息块 / Select 弹层' },
    { label: '按钮 / 输入框', value: '8px', sample: 8, note: 'rounded-lg 通用控件' },
    { label: '标签 chip', value: '4px', sample: 4, note: '话题标签 / 平台徽标' },
    { label: '风险 / 情感 pill', value: '999px', sample: 999, note: 'h-28 px-16 圆角胶囊' },
  ];

  const spacingSpecs = [
    { label: '主卡片内边距', value: '24px', detail: 'p-6 通用' },
    { label: '右侧栏分块', value: '24px', detail: 'px-5 py-6，分割线两侧 24px' },
    { label: '卡片之间', value: '24px', detail: 'space-y-6 / gap-6' },
    { label: '模块之间', value: '32px', detail: 'space-y-8 主区块' },
    { label: '紧凑信息块', value: '12px', detail: 'p-3 信息块 / chip 间距' },
  ];

  const backgroundSpecs = [
    { token: '--bg-primary', usage: '页面背景 / 信息块底色' },
    { token: '--bg-card', usage: '卡片默认背景' },
    { token: '--bg-card-hover', usage: '卡片悬停 / 搜索框背景' },
    { token: '--bg-control', usage: '筛选 Select / 高级筛选按钮' },
    { token: '--bg-selected', usage: '下拉选中态背景' },
  ];

  const shadowSpecs = [
    {
      label: '主卡片',
      shadow: 'none',
      note: '只使用 1px border，不加投影',
    },
    {
      label: 'Select / 弹层',
      shadow: '0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent)',
      note: '下拉、Popover、Tooltip',
    },
    {
      label: '侧边抽屉',
      shadow: '-4px 0 24px color-mix(in srgb, var(--text-strong) 8%, transparent)',
      note: 'Sheet 抽屉左侧投影',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SpecBlock title="圆角层级">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {radiusSpecs.map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-divider)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  height: 56,
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: item.sample,
                }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpecBlock>

      <SpecBlock title="间距规范">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {spacingSpecs.map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-divider)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' }}>
                {item.value}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </SpecBlock>

      <SpecBlock title="背景色 token">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {backgroundSpecs.map((item) => (
            <div
              key={item.token}
              style={{
                border: '1px solid var(--border-divider)',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 48, background: `var(${item.token})` }} />
              <div style={{ padding: 12, background: 'var(--bg-card)' }}>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 14, color: 'var(--text-strong)', fontWeight: 500 }}>
                  {item.token}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {item.usage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpecBlock>

      <SpecBlock title="投影层级">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {shadowSpecs.map((item) => (
            <div
              key={item.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-divider)',
                borderRadius: 16,
                padding: 20,
                boxShadow: item.shadow === 'none' ? undefined : item.shadow,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.note}</div>
              <code
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-primary)',
                  borderRadius: 4,
                  padding: '6px 8px',
                  wordBreak: 'break-all',
                }}
              >
                box-shadow: {item.shadow}
              </code>
            </div>
          ))}
        </div>
      </SpecBlock>
    </div>
  );
}

function BusinessFilterDrawerPreview() {
  return (
    <div
      style={{
        position: 'relative',
        height: 520,
        borderRadius: 16,
        border: '1px solid var(--border-divider)',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          点击「高级筛选」后右侧滑出抽屉，宽度 380px，左侧投影区分主页面。
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['抖音', '价格', '互动≥1000'].map((label) => (
            <span key={label} style={filterChipStyle}>{label}</span>
          ))}
        </div>
      </div>
      <div
        style={{
          width: 380,
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-divider)',
          boxShadow: '-4px 0 24px color-mix(in srgb, var(--text-strong) 8%, transparent)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '16px 16px 16px 24px',
            borderBottom: '1px solid var(--border-divider)',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' }}>
            高级筛选
          </span>
          <button
            type="button"
            aria-label="关闭"
            style={{
              display: 'inline-flex',
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              border: '1px solid transparent',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, flex: 1, overflow: 'hidden' }}>
          <DrawerSectionPreview
            title="渠道"
            chips={[
              { label: '微博', active: false },
              { label: '抖音', active: true },
              { label: '小红书', active: false },
              { label: '行业社区', active: false },
            ]}
          />
          <DrawerSectionPreview
            title="标签"
            chips={[
              { label: '配置', active: false },
              { label: '价格', active: true },
              { label: '外观', active: false },
            ]}
          />
          <DrawerSectionPreview
            title="等级"
            chips={[
              { label: 'S', active: true },
              { label: 'A', active: false },
              { label: 'B', active: false },
              { label: '普通', active: false },
            ]}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, padding: '16px 24px 24px' }}>
          <Button variant="outline" className="h-10 flex-1 hover:border-[var(--text-strong)]">
            清空
          </Button>
          <Button className="h-10 flex-1">应用</Button>
        </div>
      </div>
    </div>
  );
}

function SpecBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DrawerSectionPreview({
  title,
  chips,
}: {
  title: string;
  chips: { label: string; active: boolean }[];
}) {
  return (
    <div>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', margin: '0 0 12px' }}>
        {title}
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {chips.map((chip) => (
          <span
            key={chip.label}
            style={{
              display: 'inline-flex',
              height: 32,
              alignItems: 'center',
              borderRadius: 6,
              border: chip.active ? '1px solid var(--highlight)' : '1px solid var(--border-divider)',
              background: chip.active ? 'var(--highlight)' : 'transparent',
              color: chip.active ? 'var(--bg-card)' : 'var(--text-secondary)',
              padding: '0 12px',
              fontSize: 14,
              fontWeight: chip.active ? 700 : 500,
            }}
          >
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BusinessOverlayStatePreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 16 }}>Tooltip</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">查看指标解释</Button>
          </TooltipTrigger>
          <TooltipContent>阅读量来自平台公开互动数据</TooltipContent>
        </Tooltip>
      </Card>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 16 }}>Popover</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">分享</Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 border-0 bg-[var(--bg-card)] p-2 ring-0">
            <button type="button" style={popoverItemStyle}>复制链接</button>
            <button type="button" style={popoverItemStyle}>生成海报</button>
          </PopoverContent>
        </Popover>
      </Card>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 16 }}>状态</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton style={{ height: 16, width: '80%' }} />
          <Skeleton style={{ height: 16, width: '60%' }} />
          <div style={emptyNoticeStyle}>暂无重点评论，后续采集到高互动评论后展示。</div>
        </div>
      </Card>
    </div>
  );
}

function SectionTitlePreview({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: '1px solid var(--border-divider)',
        paddingBottom: 16,
        marginBottom: 16,
      }}
    >
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', margin: 0 }}>
        <DetailSectionIcon />
        {title}
      </h3>
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{subtitle}</span>
    </div>
  );
}

function InfoBlockPreview({
  label,
  value,
  progress,
  compact = false,
}: {
  label: string;
  value: string;
  progress?: number;
  compact?: boolean;
}) {
  return (
    <div style={{ borderRadius: 8, background: 'var(--bg-primary)', padding: compact ? 12 : 16 }}>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: compact ? undefined : 'var(--font-data)', fontSize: compact ? 18 : 14, fontWeight: compact ? 700 : 400, color: 'var(--text-strong)' }}>
          {value}
        </span>
        {progress !== undefined && (
          <span style={{ flex: 1, height: 6, borderRadius: 999, overflow: 'hidden', background: 'var(--border-divider)' }}>
            <span style={{ display: 'block', width: `${progress}%`, height: '100%', background: 'var(--highlight)' }} />
          </span>
        )}
      </div>
    </div>
  );
}

function SidePanelBlock({
  title,
  children,
  divided = false,
}: {
  title: string;
  children: React.ReactNode;
  divided?: boolean;
}) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 24,
        borderTop: divided ? '1px solid var(--border-divider)' : undefined,
      }}
    >
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', margin: '0 0 16px' }}>
        <span aria-hidden style={{ width: 4, height: 16, borderRadius: 2, background: 'var(--highlight)' }} />
        {title}
      </h3>
      {children}
    </div>
  );
}

function KeyValuePreview({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 14 }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--text-strong)' }}>{value}</span>
    </div>
  );
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 8,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

function WordCloudReferenceSVG() {
  return (
    <svg
      role="img"
      aria-label="词云图设计参考"
      width="100%"
      style={{ height: 'auto' }}
      viewBox="0 0 734 323"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M717.5 0.5C726.336 0.5 733.5 7.66353 733.5 16.4999V306.5C733.5 315.336 726.336 322.5 717.5 322.5H16.4999C7.66361 322.5 0.5 315.336 0.5 306.5V16.4999C0.5 7.66353 7.66361 0.5 16.4999 0.5H717.5Z"
        fill="white"
        stroke="var(--border-divider)"
      />
      <path
        d="M192.5 70.5C192.5 58.902 201.902 49.5 213.5 49.5H267.5C279.098 49.5 288.5 58.902 288.5 70.5C288.5 82.098 279.098 91.5 267.5 91.5H213.5C201.902 91.5 192.5 82.098 192.5 70.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M225.652 65.076H230.324C232.948 65.076 234.26 66.196 234.26 68.436C234.26 70.692 232.932 71.828 230.308 71.828H226.964V76.5H225.652V65.076ZM226.964 66.212V70.692H230.244C231.172 70.692 231.844 70.5 232.292 70.132C232.724 69.764 232.948 69.204 232.948 68.436C232.948 67.668 232.724 67.108 232.276 66.772C231.828 66.388 231.156 66.212 230.244 66.212H226.964ZM240.846 64.852C242.11 64.852 243.182 65.188 244.046 65.86C244.91 66.532 245.422 67.444 245.582 68.58H244.318C244.158 67.748 243.742 67.108 243.102 66.66C242.478 66.228 241.726 66.02 240.83 66.02C239.502 66.02 238.478 66.484 237.758 67.412C237.086 68.276 236.75 69.412 236.75 70.836C236.75 72.26 237.07 73.396 237.742 74.228C238.446 75.108 239.454 75.556 240.798 75.556C241.71 75.556 242.478 75.316 243.118 74.836C243.79 74.324 244.254 73.572 244.478 72.58H245.742C245.486 73.908 244.894 74.948 243.95 75.684C243.07 76.372 242.014 76.724 240.798 76.724C239.022 76.724 237.662 76.132 236.718 74.964C235.854 73.908 235.438 72.532 235.438 70.836C235.438 69.14 235.87 67.748 236.75 66.66C237.71 65.444 239.086 64.852 240.846 64.852ZM247.558 65.076H255.206V66.212H248.87V70.052H254.87V71.188H248.87V76.5H247.558V65.076Z"
        fill="var(--text-secondary)"
      />
      <rect x="132.5" y="197.5" width="123" height="36" rx="18" fill="var(--highlight)" fillOpacity="0.1" />
      <path
        d="M165.994 209.766H169.466C171.78 209.766 173.271 210.451 173.939 211.822C174.18 212.326 174.3 212.924 174.3 213.615C174.3 214.307 174.177 214.898 173.931 215.391C173.685 215.883 173.354 216.287 172.938 216.604C172.129 217.213 171.048 217.518 169.694 217.518H167.752V222H165.994V209.766ZM169.352 216.111C170.412 216.111 171.197 215.906 171.707 215.496C172.217 215.086 172.472 214.447 172.472 213.58C172.472 212.426 171.936 211.682 170.863 211.348C170.488 211.23 170.034 211.172 169.501 211.172H167.752V216.111H169.352ZM180.452 214.301C179.585 214.301 178.812 214.597 178.132 215.188V222H176.374V208.922H178.132V213.905C179.081 213.161 180.062 212.789 181.076 212.789C182.16 212.789 182.954 213.111 183.458 213.756C183.985 214.436 184.249 215.531 184.249 217.043V222H182.491V217.043C182.491 215.59 182.096 214.723 181.305 214.441C181.053 214.348 180.769 214.301 180.452 214.301ZM186.49 224.25C186.648 224.297 186.862 224.32 187.132 224.32C187.407 224.32 187.688 224.265 187.976 224.153C188.263 224.048 188.512 223.898 188.723 223.705C189.074 223.389 189.394 222.891 189.681 222.211L185.954 212.93H187.826L190.445 220.154L192.792 212.93H194.646L190.92 223.116C190.639 223.878 190.249 224.461 189.751 224.865C189.095 225.393 188.219 225.656 187.123 225.656C187.023 225.656 186.921 225.65 186.815 225.639L186.49 225.604V224.25ZM199.146 220.611C199.34 220.682 199.633 220.717 200.025 220.717C200.418 220.717 200.746 220.67 201.01 220.576V221.982C200.887 222.012 200.708 222.029 200.474 222.035L199.92 222.053C199.797 222.053 199.703 222.053 199.639 222.053C198.508 222.053 197.673 221.684 197.134 220.945C196.7 220.348 196.483 219.557 196.483 218.572V214.274H195.183V213.448L196.483 212.93L196.905 210.68H198.241V212.93H201.054V214.274H198.241V218.563C198.241 219.712 198.543 220.395 199.146 220.611ZM202.803 217.447C202.803 216.023 203.257 214.869 204.165 213.984C205.015 213.158 206.066 212.745 207.32 212.745C208.551 212.745 209.579 213.158 210.405 213.984C211.284 214.863 211.724 216.018 211.724 217.447C211.724 218.871 211.281 220.02 210.396 220.893C209.559 221.725 208.53 222.141 207.312 222.141C206.075 222.141 205.026 221.725 204.165 220.893C203.257 220.02 202.803 218.871 202.803 217.447ZM204.631 217.447C204.631 218.947 205.111 219.967 206.072 220.506C206.412 220.693 206.819 220.787 207.294 220.787C207.769 220.787 208.17 220.693 208.498 220.506C208.826 220.312 209.096 220.061 209.307 219.75C209.699 219.152 209.896 218.385 209.896 217.447C209.896 215.959 209.424 214.939 208.48 214.389C208.152 214.195 207.76 214.099 207.303 214.099C206.846 214.099 206.447 214.195 206.107 214.389C205.773 214.576 205.498 214.825 205.281 215.136C204.848 215.745 204.631 216.516 204.631 217.447ZM217.085 217.438H213.376V216.103H217.085V212.402H218.421V216.103H222.191V217.438H218.421V221.209H217.085V217.438Z"
        fill="var(--highlight)"
      />
      <path
        d="M365.5 228.5C365.5 219.663 372.663 212.5 381.5 212.5H455.5C464.337 212.5 471.5 219.663 471.5 228.5C471.5 237.337 464.337 244.5 455.5 244.5H381.5C372.663 244.5 365.5 237.337 365.5 228.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M405.606 222.02L406.586 222.146C406.46 222.51 406.306 222.86 406.138 223.196H410.142V224.064C409.68 224.988 408.98 225.786 408.042 226.458C408.854 226.822 409.792 227.13 410.87 227.382L410.478 228.32C409.12 227.984 407.986 227.564 407.076 227.06C406.096 227.592 404.934 228.026 403.576 228.362L403.198 227.452C404.332 227.186 405.326 226.85 406.166 226.458C405.578 226.01 405.102 225.506 404.766 224.974C404.472 225.254 404.164 225.506 403.828 225.758L403.254 225.002C404.402 224.19 405.186 223.196 405.606 222.02ZM405.396 224.302C405.788 224.932 406.348 225.478 407.09 225.954C407.93 225.422 408.574 224.82 409.05 224.12H405.536C405.48 224.176 405.438 224.246 405.396 224.302ZM401.028 222.048L401.924 222.468C401.588 223.518 401.182 224.512 400.692 225.436V234.914H399.726V227.032C399.292 227.662 398.816 228.264 398.298 228.824L398.004 227.816C399.39 226.136 400.398 224.218 401.028 222.048ZM401.938 224.526H402.848V232.45H401.938V224.526ZM407.538 227.97L408.266 228.432C407.734 228.88 407.202 229.244 406.656 229.538C406.068 229.846 405.298 230.154 404.346 230.462L403.856 229.664C404.64 229.468 405.354 229.23 405.998 228.936C406.558 228.656 407.062 228.334 407.538 227.97ZM408.868 229.006L409.54 229.524C408.42 230.924 406.782 231.918 404.612 232.534L404.206 231.68C406.278 231.134 407.832 230.238 408.868 229.006ZM404.052 234.998L403.632 234.074C405.228 233.654 406.516 233.15 407.51 232.562C408.504 231.988 409.358 231.232 410.058 230.308L410.772 230.84C410.156 231.806 409.218 232.66 407.958 233.388C406.698 234.088 405.396 234.634 404.052 234.998ZM412.368 222.79H424.632V223.77H412.368V222.79ZM416.526 234.872H415.476L415.224 233.948L416.218 233.99C416.554 233.99 416.736 233.794 416.736 233.43V226.178H413.936V234.914H413.012V225.226H417.674V233.626C417.674 234.452 417.282 234.872 416.526 234.872ZM414.958 227.676C415.546 228.656 416.064 229.706 416.484 230.812L415.672 231.162C415.224 229.944 414.734 228.88 414.202 227.984L414.958 227.676ZM422.784 234.872H421.818L421.566 233.948L422.476 233.99C422.854 233.99 423.05 233.794 423.05 233.402V226.178H420.236V234.914H419.298V225.226H423.974V233.598C423.974 234.438 423.568 234.872 422.784 234.872ZM421.244 227.662C421.846 228.67 422.364 229.734 422.798 230.854L421.986 231.204C421.538 229.972 421.034 228.894 420.488 227.97L421.244 227.662ZM426.27 222.902H438.758V223.882H436.91V233.402C436.91 234.326 436.462 234.802 435.566 234.802H433.228L433.004 233.822C433.774 233.85 434.516 233.878 435.216 233.878C435.664 233.878 435.902 233.626 435.902 233.15V223.882H426.27V222.902ZM433.34 226.024V231.162H428.874V232.394H427.894V226.024H433.34ZM428.874 230.238H432.374V226.934H428.874V230.238Z"
        fill="var(--text-secondary)"
        fillOpacity="0.5"
      />
      <rect x="263.5" y="151.5" width="142" height="56" rx="28" fill="var(--highlight)" fillOpacity="0.1" />
      <path
        d="M313.648 178.964L315.13 179.588C314.61 180.125 313.977 180.637 313.232 181.122C312.504 181.607 311.724 182.041 310.892 182.422C310.06 182.803 309.228 183.133 308.396 183.41C308.275 183.219 308.101 183.02 307.876 182.812C307.668 182.587 307.477 182.396 307.304 182.24C308.084 181.997 308.873 181.711 309.67 181.382C310.467 181.053 311.213 180.68 311.906 180.264C312.599 179.848 313.18 179.415 313.648 178.964ZM316.144 181.486L317.6 182.084C316.941 182.812 316.135 183.479 315.182 184.086C314.246 184.675 313.215 185.204 312.088 185.672C310.979 186.123 309.835 186.513 308.656 186.842C308.552 186.651 308.405 186.435 308.214 186.192C308.023 185.932 307.833 185.715 307.642 185.542C308.751 185.282 309.843 184.961 310.918 184.58C311.993 184.181 312.981 183.722 313.882 183.202C314.801 182.665 315.555 182.093 316.144 181.486ZM318.562 184.32L320.252 185.048C319.403 186.071 318.311 186.972 316.976 187.752C315.641 188.515 314.142 189.156 312.478 189.676C310.831 190.213 309.089 190.647 307.252 190.976C307.148 190.751 307.001 190.482 306.81 190.17C306.619 189.858 306.429 189.598 306.238 189.39C307.989 189.13 309.653 188.775 311.23 188.324C312.807 187.873 314.229 187.319 315.494 186.66C316.777 185.984 317.799 185.204 318.562 184.32ZM310.19 167.134L311.984 167.602C311.36 169.145 310.571 170.618 309.618 172.022C308.665 173.409 307.668 174.579 306.628 175.532C306.524 175.428 306.377 175.307 306.186 175.168C306.013 175.012 305.831 174.865 305.64 174.726C305.449 174.57 305.276 174.457 305.12 174.388C306.177 173.504 307.148 172.429 308.032 171.164C308.933 169.881 309.653 168.538 310.19 167.134ZM309.618 169.994H320.2V171.632H308.63L309.618 169.994ZM316.638 170.358L318.484 170.774C317.773 172.421 316.82 173.851 315.624 175.064C314.445 176.26 313.076 177.274 311.516 178.106C309.973 178.938 308.301 179.64 306.498 180.212C306.429 180.056 306.325 179.883 306.186 179.692C306.047 179.501 305.9 179.311 305.744 179.12C305.588 178.929 305.458 178.773 305.354 178.652C307.105 178.201 308.717 177.612 310.19 176.884C311.681 176.139 312.972 175.229 314.064 174.154C315.173 173.079 316.031 171.814 316.638 170.358ZM309.436 171.008C309.973 172.048 310.753 173.062 311.776 174.05C312.816 175.038 314.107 175.913 315.65 176.676C317.21 177.439 319.004 178.011 321.032 178.392C320.911 178.513 320.781 178.669 320.642 178.86C320.503 179.051 320.373 179.241 320.252 179.432C320.131 179.623 320.027 179.805 319.94 179.978C317.912 179.51 316.127 178.851 314.584 178.002C313.041 177.153 311.741 176.208 310.684 175.168C309.627 174.111 308.803 173.045 308.214 171.97L309.436 171.008ZM303.56 170.254H305.302V186.764H303.56V170.254ZM301.558 167.316L303.352 167.81C302.867 169.318 302.286 170.809 301.61 172.282C300.951 173.755 300.223 175.142 299.426 176.442C298.646 177.742 297.831 178.903 296.982 179.926C296.93 179.77 296.843 179.571 296.722 179.328C296.601 179.068 296.471 178.817 296.332 178.574C296.193 178.314 296.072 178.097 295.968 177.924C296.713 177.057 297.433 176.061 298.126 174.934C298.837 173.79 299.478 172.568 300.05 171.268C300.639 169.968 301.142 168.651 301.558 167.316ZM299.478 173.66L301.272 171.866L301.324 171.918V191.08H299.478V173.66ZM326.7 178.626L328.208 178.054C328.537 178.591 328.867 179.172 329.196 179.796C329.525 180.42 329.829 181.027 330.106 181.616C330.401 182.205 330.626 182.734 330.782 183.202L329.196 183.904C329.023 183.436 328.797 182.899 328.52 182.292C328.243 181.685 327.948 181.061 327.636 180.42C327.324 179.779 327.012 179.181 326.7 178.626ZM338.088 178.912L339.57 178.314C339.899 178.834 340.229 179.406 340.558 180.03C340.905 180.637 341.225 181.226 341.52 181.798C341.815 182.37 342.049 182.881 342.222 183.332L340.688 184.034C340.515 183.583 340.281 183.063 339.986 182.474C339.691 181.885 339.379 181.278 339.05 180.654C338.721 180.013 338.4 179.432 338.088 178.912ZM322.878 168.72H346.122V170.618H322.878V168.72ZM324.308 173.296H332.264V175.09H326.128V191.054H324.308V173.296ZM335.566 173.296H343.938V175.09H337.412V191.054H335.566V173.296ZM331.354 173.296H333.278V188.662C333.278 189.182 333.217 189.589 333.096 189.884C332.975 190.179 332.749 190.413 332.42 190.586C332.091 190.742 331.666 190.837 331.146 190.872C330.626 190.924 329.967 190.941 329.17 190.924C329.135 190.664 329.057 190.352 328.936 189.988C328.832 189.624 328.711 189.312 328.572 189.052C329.109 189.069 329.595 189.078 330.028 189.078C330.479 189.078 330.782 189.078 330.938 189.078C331.215 189.078 331.354 188.939 331.354 188.662V173.296ZM342.976 173.296H344.9V188.714C344.9 189.234 344.839 189.641 344.718 189.936C344.597 190.248 344.371 190.482 344.042 190.638C343.695 190.777 343.245 190.863 342.69 190.898C342.135 190.933 341.442 190.95 340.61 190.95C340.575 190.707 340.506 190.404 340.402 190.04C340.298 189.676 340.177 189.373 340.038 189.13C340.61 189.147 341.13 189.156 341.598 189.156C342.066 189.156 342.378 189.156 342.534 189.156C342.829 189.139 342.976 188.991 342.976 188.714V173.296ZM366.922 169.578H368.95V188.272C368.95 188.965 368.846 189.494 368.638 189.858C368.447 190.239 368.092 190.517 367.572 190.69C367.069 190.863 366.359 190.959 365.44 190.976C364.539 191.011 363.438 191.028 362.138 191.028C362.103 190.837 362.034 190.612 361.93 190.352C361.843 190.109 361.748 189.858 361.644 189.598C361.54 189.338 361.436 189.113 361.332 188.922C362.025 188.957 362.701 188.983 363.36 189C364.036 189 364.617 189 365.102 189C365.605 189 365.96 189 366.168 189C366.445 188.965 366.636 188.905 366.74 188.818C366.861 188.714 366.922 188.523 366.922 188.246V169.578ZM351.608 174.778H353.506V186.582H351.608V174.778ZM352.414 174.778H362.268V184.502H352.414V182.63H360.344V176.65H352.414V174.778ZM348.956 169.006H372.148V170.956H348.956V169.006Z"
        fill="var(--highlight)"
      />
      <rect x="256.5" y="254.5" width="215" height="38" rx="19" fill="var(--highlight)" fillOpacity="0.1" />
      <path
        d="M290.16 267.406H293.588C295.834 267.406 297.283 268.054 297.934 269.35C298.174 269.838 298.295 270.323 298.295 270.805C298.295 271.286 298.243 271.671 298.139 271.957C298.041 272.237 297.908 272.494 297.738 272.729C297.419 273.171 296.996 273.549 296.469 273.861V273.9C297.445 274.18 298.165 274.672 298.627 275.375C298.979 275.909 299.154 276.501 299.154 277.152C299.154 277.803 299.024 278.367 298.764 278.842C298.51 279.317 298.155 279.714 297.699 280.033C296.768 280.678 295.525 281 293.969 281H290.16V267.406ZM293.959 273.334C295.007 273.334 295.714 272.921 296.078 272.094C296.202 271.801 296.264 271.475 296.264 271.117C296.264 270.753 296.218 270.44 296.127 270.18C296.036 269.913 295.889 269.685 295.688 269.496C295.258 269.092 294.61 268.891 293.744 268.891H292.113V273.334H293.959ZM297.123 277.191C297.123 275.609 296.173 274.818 294.271 274.818H292.113V279.516H293.969C295.401 279.516 296.368 279.083 296.869 278.217C297.038 277.924 297.123 277.582 297.123 277.191ZM301.557 278.939C302.442 279.187 303.516 279.311 304.779 279.311C306.042 279.311 306.996 279.109 307.641 278.705C308.292 278.295 308.617 277.644 308.617 276.752C308.617 275.938 308.344 275.346 307.797 274.975C307.165 274.538 306.114 274.32 304.643 274.32H301.918V267.758H309.936V269.594H303.793V272.68H304.936C306.908 272.68 308.344 272.999 309.242 273.637C310.167 274.294 310.629 275.346 310.629 276.791C310.629 278.061 310.167 279.073 309.242 279.828C308.227 280.668 306.736 281.088 304.77 281.088C303.331 281.088 302.26 281.003 301.557 280.834V278.939ZM330.48 271.06H331.98V282.6H330.48V271.06ZM324.64 274H337.6V275.38H324.64V274ZM332.42 274.56C332.82 275.36 333.326 276.147 333.94 276.92C334.553 277.68 335.226 278.38 335.96 279.02C336.693 279.647 337.42 280.16 338.14 280.56C338.033 280.653 337.906 280.773 337.76 280.92C337.626 281.053 337.5 281.193 337.38 281.34C337.26 281.487 337.16 281.627 337.08 281.76C336.346 281.28 335.613 280.68 334.88 279.96C334.16 279.24 333.486 278.453 332.86 277.6C332.233 276.747 331.7 275.88 331.26 275L332.42 274.56ZM330.14 274.44L331.32 274.88C330.866 275.8 330.306 276.7 329.64 277.58C328.973 278.447 328.246 279.24 327.46 279.96C326.686 280.667 325.9 281.253 325.1 281.72C325.02 281.587 324.92 281.447 324.8 281.3C324.68 281.167 324.553 281.033 324.42 280.9C324.3 280.753 324.18 280.633 324.06 280.54C324.846 280.14 325.626 279.62 326.4 278.98C327.173 278.34 327.88 277.627 328.52 276.84C329.173 276.053 329.713 275.253 330.14 274.44ZM327.56 266.48V270.16H335V266.48H327.56ZM326.12 265.14H336.5V271.52H326.12V265.14ZM324.06 264.26L325.46 264.7C325.02 265.82 324.5 266.927 323.9 268.02C323.3 269.113 322.653 270.14 321.96 271.1C321.266 272.06 320.553 272.913 319.82 273.66C319.78 273.54 319.706 273.387 319.6 273.2C319.506 273.013 319.4 272.827 319.28 272.64C319.173 272.453 319.073 272.3 318.98 272.18C319.646 271.54 320.293 270.8 320.92 269.96C321.546 269.107 322.126 268.2 322.66 267.24C323.206 266.267 323.673 265.273 324.06 264.26ZM321.98 269.42L323.38 268L323.42 268.02V282.54H321.98V269.42ZM347.18 269.54V271.56H354.86V269.54H347.18ZM347.18 266.32V268.32H354.86V266.32H347.18ZM345.76 265.06H356.32V272.82H345.76V265.06ZM343.72 280.68H357.74V282.02H343.72V280.68ZM344.9 275.06L346.12 274.62C346.413 275.1 346.68 275.613 346.92 276.16C347.173 276.707 347.393 277.247 347.58 277.78C347.766 278.313 347.9 278.787 347.98 279.2L346.66 279.68C346.58 279.253 346.453 278.773 346.28 278.24C346.106 277.693 345.9 277.147 345.66 276.6C345.433 276.04 345.18 275.527 344.9 275.06ZM355.88 274.52L357.32 274.98C357.093 275.5 356.84 276.047 356.56 276.62C356.293 277.193 356.026 277.747 355.76 278.28C355.506 278.813 355.253 279.28 355 279.68L353.9 279.26C354.126 278.833 354.36 278.347 354.6 277.8C354.853 277.24 355.093 276.673 355.32 276.1C355.546 275.527 355.733 275 355.88 274.52ZM348.6 273.48H349.98V281.46H348.6V273.48ZM352.02 273.48H353.42V281.46H352.02V273.48ZM340.38 265.52L341.2 264.44C341.613 264.6 342.04 264.8 342.48 265.04C342.92 265.267 343.333 265.507 343.72 265.76C344.12 266.013 344.44 266.253 344.68 266.48L343.82 267.7C343.58 267.473 343.266 267.227 342.88 266.96C342.493 266.693 342.08 266.433 341.64 266.18C341.213 265.927 340.793 265.707 340.38 265.52ZM339.28 270.8L340.14 269.7C340.553 269.873 340.98 270.08 341.42 270.32C341.873 270.547 342.3 270.787 342.7 271.04C343.1 271.293 343.426 271.533 343.68 271.76L342.8 272.96C342.56 272.733 342.24 272.493 341.84 272.24C341.453 271.973 341.033 271.713 340.58 271.46C340.14 271.193 339.706 270.973 339.28 270.8ZM339.82 281.32C340.113 280.8 340.433 280.187 340.78 279.48C341.126 278.76 341.473 278 341.82 277.2C342.18 276.4 342.506 275.627 342.8 274.88L343.98 275.74C343.713 276.433 343.42 277.167 343.1 277.94C342.78 278.7 342.453 279.447 342.12 280.18C341.786 280.9 341.46 281.573 341.14 282.2L339.82 281.32ZM372.48 273.28L373.62 273.76C373.22 274.173 372.733 274.567 372.16 274.94C371.6 275.313 371 275.647 370.36 275.94C369.72 276.233 369.08 276.487 368.44 276.7C368.346 276.553 368.213 276.4 368.04 276.24C367.88 276.067 367.733 275.92 367.6 275.8C368.2 275.613 368.806 275.393 369.42 275.14C370.033 274.887 370.606 274.6 371.14 274.28C371.673 273.96 372.12 273.627 372.48 273.28ZM374.4 275.22L375.52 275.68C375.013 276.24 374.393 276.753 373.66 277.22C372.94 277.673 372.146 278.08 371.28 278.44C370.426 278.787 369.546 279.087 368.64 279.34C368.56 279.193 368.446 279.027 368.3 278.84C368.153 278.64 368.006 278.473 367.86 278.34C368.713 278.14 369.553 277.893 370.38 277.6C371.206 277.293 371.966 276.94 372.66 276.54C373.366 276.127 373.946 275.687 374.4 275.22ZM376.26 277.4L377.56 277.96C376.906 278.747 376.066 279.44 375.04 280.04C374.013 280.627 372.86 281.12 371.58 281.52C370.313 281.933 368.973 282.267 367.56 282.52C367.48 282.347 367.366 282.14 367.22 281.9C367.073 281.66 366.926 281.46 366.78 281.3C368.126 281.1 369.406 280.827 370.62 280.48C371.833 280.133 372.926 279.707 373.9 279.2C374.886 278.68 375.673 278.08 376.26 277.4ZM369.82 264.18L371.2 264.54C370.72 265.727 370.113 266.86 369.38 267.94C368.646 269.007 367.88 269.907 367.08 270.64C367 270.56 366.886 270.467 366.74 270.36C366.606 270.24 366.466 270.127 366.32 270.02C366.173 269.9 366.04 269.813 365.92 269.76C366.733 269.08 367.48 268.253 368.16 267.28C368.853 266.293 369.406 265.26 369.82 264.18ZM369.38 266.38H377.52V267.64H368.62L369.38 266.38ZM374.78 266.66L376.2 266.98C375.653 268.247 374.92 269.347 374 270.28C373.093 271.2 372.04 271.98 370.84 272.62C369.653 273.26 368.366 273.8 366.98 274.24C366.926 274.12 366.846 273.987 366.74 273.84C366.633 273.693 366.52 273.547 366.4 273.4C366.28 273.253 366.18 273.133 366.1 273.04C367.446 272.693 368.686 272.24 369.82 271.68C370.966 271.107 371.96 270.407 372.8 269.58C373.653 268.753 374.313 267.78 374.78 266.66ZM369.24 267.16C369.653 267.96 370.253 268.74 371.04 269.5C371.84 270.26 372.833 270.933 374.02 271.52C375.22 272.107 376.6 272.547 378.16 272.84C378.066 272.933 377.966 273.053 377.86 273.2C377.753 273.347 377.653 273.493 377.56 273.64C377.466 273.787 377.386 273.927 377.32 274.06C375.76 273.7 374.386 273.193 373.2 272.54C372.013 271.887 371.013 271.16 370.2 270.36C369.386 269.547 368.753 268.727 368.3 267.9L369.24 267.16ZM364.72 266.58H366.06V279.28H364.72V266.58ZM363.18 264.32L364.56 264.7C364.186 265.86 363.74 267.007 363.22 268.14C362.713 269.273 362.153 270.34 361.54 271.34C360.94 272.34 360.313 273.233 359.66 274.02C359.62 273.9 359.553 273.747 359.46 273.56C359.366 273.36 359.266 273.167 359.16 272.98C359.053 272.78 358.96 272.613 358.88 272.48C359.453 271.813 360.006 271.047 360.54 270.18C361.086 269.3 361.58 268.36 362.02 267.36C362.473 266.36 362.86 265.347 363.18 264.32ZM361.58 269.2L362.96 267.82L363 267.86V282.6H361.58V269.2ZM379.28 274.82C379.853 274.687 380.5 274.52 381.22 274.32C381.94 274.12 382.706 273.9 383.52 273.66C384.333 273.407 385.146 273.16 385.96 272.92L386.18 274.3C385.06 274.66 383.926 275.013 382.78 275.36C381.646 275.707 380.62 276.02 379.7 276.3L379.28 274.82ZM379.6 268.24H386.06V269.68H379.6V268.24ZM382.28 264.22H383.74V280.72C383.74 281.133 383.686 281.46 383.58 281.7C383.486 281.94 383.306 282.12 383.04 282.24C382.786 282.36 382.446 282.433 382.02 282.46C381.606 282.5 381.066 282.52 380.4 282.52C380.36 282.32 380.3 282.08 380.22 281.8C380.14 281.533 380.046 281.293 379.94 281.08C380.393 281.093 380.806 281.1 381.18 281.1C381.553 281.1 381.8 281.093 381.92 281.08C382.053 281.08 382.146 281.053 382.2 281C382.253 280.96 382.28 280.867 382.28 280.72V264.22ZM388.48 272.84H396.32V274.26H388.48V272.84ZM388.42 267.66H397.02V275.52H395.52V269.02H388.42V267.66ZM387.46 267.66H388.96V273.04C388.96 273.773 388.926 274.567 388.86 275.42C388.793 276.26 388.66 277.113 388.46 277.98C388.273 278.833 387.993 279.66 387.62 280.46C387.26 281.26 386.78 281.987 386.18 282.64C386.1 282.533 385.986 282.413 385.84 282.28C385.693 282.147 385.54 282.013 385.38 281.88C385.233 281.747 385.1 281.647 384.98 281.58C385.54 280.967 385.98 280.307 386.3 279.6C386.633 278.88 386.88 278.14 387.04 277.38C387.213 276.62 387.326 275.873 387.38 275.14C387.433 274.393 387.46 273.68 387.46 273V267.66ZM390.34 264.78L391.68 264.26C392.066 264.7 392.44 265.18 392.8 265.7C393.16 266.22 393.426 266.673 393.6 267.06L392.2 267.68C392.026 267.267 391.766 266.793 391.42 266.26C391.073 265.727 390.713 265.233 390.34 264.78ZM402.16 264.26H403.54V282.56H402.16V264.26ZM399.34 270.92H405.78V272.32H399.34V270.92ZM402.08 271.66L403.04 272.06C402.88 272.74 402.686 273.453 402.46 274.2C402.233 274.933 401.98 275.667 401.7 276.4C401.433 277.133 401.146 277.82 400.84 278.46C400.533 279.1 400.22 279.647 399.9 280.1C399.86 279.94 399.793 279.773 399.7 279.6C399.606 279.413 399.506 279.233 399.4 279.06C399.293 278.873 399.2 278.713 399.12 278.58C399.506 278.06 399.893 277.407 400.28 276.62C400.666 275.82 401.02 274.987 401.34 274.12C401.66 273.24 401.906 272.42 402.08 271.66ZM403.5 272.7C403.62 272.86 403.8 273.113 404.04 273.46C404.293 273.807 404.56 274.187 404.84 274.6C405.133 275 405.4 275.38 405.64 275.74C405.88 276.087 406.046 276.347 406.14 276.52L405.12 277.66C405.026 277.393 404.873 277.067 404.66 276.68C404.46 276.28 404.233 275.86 403.98 275.42C403.74 274.98 403.506 274.573 403.28 274.2C403.066 273.813 402.893 273.513 402.76 273.3L403.5 272.7ZM399.54 265.76L400.58 265.5C400.766 265.953 400.94 266.447 401.1 266.98C401.26 267.513 401.393 268.033 401.5 268.54C401.62 269.033 401.7 269.48 401.74 269.88L400.64 270.14C400.613 269.753 400.54 269.307 400.42 268.8C400.313 268.293 400.18 267.773 400.02 267.24C399.873 266.707 399.713 266.213 399.54 265.76ZM405.08 265.42L406.34 265.74C406.18 266.233 406.006 266.753 405.82 267.3C405.633 267.847 405.446 268.373 405.26 268.88C405.086 269.387 404.913 269.827 404.74 270.2L403.8 269.9C403.96 269.513 404.12 269.053 404.28 268.52C404.44 267.987 404.593 267.447 404.74 266.9C404.886 266.353 405 265.86 405.08 265.42ZM407.04 265.82H417.2V266.98H407.04V265.82ZM407.54 268.22H416.76V269.32H407.54V268.22ZM406.48 270.66H417.72V271.84H406.48V270.66ZM411.24 264.2H412.66V271.3H411.24V264.2ZM407.72 273.04H415.42V274.18H409.16V282.58H407.72V273.04ZM414.98 273.04H416.38V281.04C416.38 281.4 416.333 281.68 416.24 281.88C416.16 282.093 415.986 282.253 415.72 282.36C415.453 282.467 415.106 282.527 414.68 282.54C414.253 282.567 413.726 282.58 413.1 282.58C413.073 282.393 413.013 282.18 412.92 281.94C412.84 281.713 412.753 281.507 412.66 281.32C413.113 281.333 413.526 281.34 413.9 281.34C414.273 281.353 414.52 281.353 414.64 281.34C414.773 281.34 414.86 281.313 414.9 281.26C414.953 281.22 414.98 281.147 414.98 281.04V273.04ZM408.48 275.68H415.54V276.76H408.48V275.68ZM408.48 278.26H415.54V279.32H408.48V278.26ZM435.64 265.54L436.78 266.68C435.886 267.24 434.86 267.76 433.7 268.24C432.54 268.72 431.313 269.167 430.02 269.58C428.74 269.98 427.473 270.34 426.22 270.66C426.18 270.487 426.1 270.287 425.98 270.06C425.873 269.82 425.766 269.62 425.66 269.46C426.58 269.22 427.513 268.96 428.46 268.68C429.406 268.387 430.32 268.073 431.2 267.74C432.08 267.393 432.9 267.04 433.66 266.68C434.42 266.307 435.08 265.927 435.64 265.54ZM429.12 264.48H430.62V271.6C430.62 271.92 430.686 272.133 430.82 272.24C430.953 272.333 431.253 272.38 431.72 272.38C431.826 272.38 432.026 272.38 432.32 272.38C432.613 272.38 432.94 272.38 433.3 272.38C433.66 272.38 433.993 272.38 434.3 272.38C434.62 272.38 434.846 272.38 434.98 272.38C435.246 272.38 435.44 272.327 435.56 272.22C435.693 272.1 435.786 271.88 435.84 271.56C435.906 271.24 435.953 270.773 435.98 270.16C436.153 270.28 436.366 270.393 436.62 270.5C436.886 270.607 437.12 270.687 437.32 270.74C437.266 271.5 437.166 272.1 437.02 272.54C436.873 272.967 436.653 273.267 436.36 273.44C436.066 273.613 435.646 273.7 435.1 273.7C435.02 273.7 434.86 273.7 434.62 273.7C434.38 273.7 434.1 273.7 433.78 273.7C433.473 273.7 433.166 273.7 432.86 273.7C432.553 273.7 432.28 273.7 432.04 273.7C431.813 273.7 431.66 273.7 431.58 273.7C430.926 273.7 430.42 273.64 430.06 273.52C429.713 273.4 429.466 273.187 429.32 272.88C429.186 272.573 429.12 272.147 429.12 271.6V264.48ZM425.02 264.16L426.42 264.66C425.94 265.46 425.38 266.24 424.74 267C424.1 267.76 423.42 268.473 422.7 269.14C421.993 269.793 421.28 270.367 420.56 270.86C420.48 270.767 420.373 270.653 420.24 270.52C420.106 270.373 419.966 270.233 419.82 270.1C419.686 269.953 419.56 269.833 419.44 269.74C420.173 269.3 420.88 268.787 421.56 268.2C422.24 267.613 422.88 266.98 423.48 266.3C424.08 265.607 424.593 264.893 425.02 264.16ZM422.98 267.44L424.06 266.36L424.48 266.48V274.26H422.98V267.44ZM427.72 274.22H429.3V282.6H427.72V274.22ZM419.56 276.56H437.5V278.02H419.56V276.56Z"
        fill="var(--highlight)"
      />
      <path
        d="M324.5 70.5C324.5 60.5589 332.559 52.5 342.5 52.5H489.5C499.441 52.5 507.5 60.5589 507.5 70.5C507.5 80.4411 499.441 88.5 489.5 88.5H342.5C332.559 88.5 324.5 80.4411 324.5 70.5Z"
        fill="var(--highlight)"
        fillOpacity="0.1"
      />
      <path
        d="M357.994 64.7656H361.466C363.78 64.7656 365.271 65.4512 365.939 66.8223C366.18 67.3262 366.3 67.9238 366.3 68.6152C366.3 69.3066 366.177 69.8984 365.931 70.3906C365.685 70.8828 365.354 71.2871 364.938 71.6035C364.129 72.2129 363.048 72.5176 361.694 72.5176H359.752V77H357.994V64.7656ZM361.352 71.1113C362.412 71.1113 363.197 70.9062 363.707 70.4961C364.217 70.0859 364.472 69.4473 364.472 68.5801C364.472 67.4258 363.936 66.6816 362.863 66.3477C362.488 66.2305 362.034 66.1719 361.501 66.1719H359.752V71.1113H361.352ZM372.452 69.3008C371.585 69.3008 370.812 69.5967 370.132 70.1885V77H368.374V63.9219H370.132V68.9053C371.081 68.1611 372.062 67.7891 373.076 67.7891C374.16 67.7891 374.954 68.1113 375.458 68.7559C375.985 69.4355 376.249 70.5312 376.249 72.043V77H374.491V72.043C374.491 70.5898 374.096 69.7227 373.305 69.4414C373.053 69.3477 372.769 69.3008 372.452 69.3008ZM378.49 79.25C378.648 79.2969 378.862 79.3203 379.132 79.3203C379.407 79.3203 379.688 79.2646 379.976 79.1533C380.263 79.0479 380.512 78.8984 380.723 78.7051C381.074 78.3887 381.394 77.8906 381.681 77.2109L377.954 67.9297H379.826L382.445 75.1543L384.792 67.9297H386.646L382.92 78.1162C382.639 78.8779 382.249 79.4609 381.751 79.8652C381.095 80.3926 380.219 80.6562 379.123 80.6562C379.023 80.6562 378.921 80.6504 378.815 80.6387L378.49 80.6035V79.25ZM391.146 75.6113C391.34 75.6816 391.633 75.7168 392.025 75.7168C392.418 75.7168 392.746 75.6699 393.01 75.5762V76.9824C392.887 77.0117 392.708 77.0293 392.474 77.0352L391.92 77.0527C391.797 77.0527 391.703 77.0527 391.639 77.0527C390.508 77.0527 389.673 76.6836 389.134 75.9453C388.7 75.3477 388.483 74.5566 388.483 73.5723V69.2744H387.183V68.4482L388.483 67.9297L388.905 65.6797H390.241V67.9297H393.054V69.2744H390.241V73.5635C390.241 74.7119 390.543 75.3945 391.146 75.6113ZM394.803 72.4473C394.803 71.0234 395.257 69.8691 396.165 68.9844C397.015 68.1582 398.066 67.7451 399.32 67.7451C400.551 67.7451 401.579 68.1582 402.405 68.9844C403.284 69.8633 403.724 71.0176 403.724 72.4473C403.724 73.8711 403.281 75.0195 402.396 75.8926C401.559 76.7246 400.53 77.1406 399.312 77.1406C398.075 77.1406 397.026 76.7246 396.165 75.8926C395.257 75.0195 394.803 73.8711 394.803 72.4473ZM396.631 72.4473C396.631 73.9473 397.111 74.9668 398.072 75.5059C398.412 75.6934 398.819 75.7871 399.294 75.7871C399.769 75.7871 400.17 75.6934 400.498 75.5059C400.826 75.3125 401.096 75.0605 401.307 74.75C401.699 74.1523 401.896 73.3848 401.896 72.4473C401.896 70.959 401.424 69.9395 400.48 69.3887C400.152 69.1953 399.76 69.0986 399.303 69.0986C398.846 69.0986 398.447 69.1953 398.107 69.3887C397.773 69.5762 397.498 69.8252 397.281 70.1357C396.848 70.7451 396.631 71.5156 396.631 72.4473ZM409.085 72.4385H405.376V71.1025H409.085V67.4023H410.421V71.1025H414.191V72.4385H410.421V76.209H409.085V72.4385ZM431.902 75.542H436.798V76.838H431.902V75.542ZM421.966 65.282H428.896V66.614H421.966V65.282ZM431.308 64.112H437.446V78.026H436.096V65.426H432.604V78.17H431.308V64.112ZM428.536 65.282H429.832C429.832 65.282 429.832 65.33 429.832 65.426C429.832 65.51 429.832 65.612 429.832 65.732C429.832 65.84 429.832 65.924 429.832 65.984C429.796 67.988 429.76 69.674 429.724 71.042C429.688 72.41 429.64 73.532 429.58 74.408C429.52 75.272 429.442 75.938 429.346 76.406C429.262 76.874 429.148 77.204 429.004 77.396C428.836 77.624 428.662 77.786 428.482 77.882C428.302 77.99 428.08 78.062 427.816 78.098C427.564 78.134 427.24 78.146 426.844 78.134C426.46 78.134 426.07 78.122 425.674 78.098C425.662 77.894 425.62 77.666 425.548 77.414C425.488 77.162 425.398 76.94 425.278 76.748C425.698 76.784 426.088 76.808 426.448 76.82C426.808 76.82 427.066 76.82 427.222 76.82C427.354 76.832 427.468 76.82 427.564 76.784C427.66 76.736 427.75 76.652 427.834 76.532C427.93 76.4 428.014 76.118 428.086 75.686C428.158 75.242 428.224 74.6 428.284 73.76C428.344 72.92 428.392 71.834 428.428 70.502C428.464 69.158 428.5 67.526 428.536 65.606V65.282ZM424.522 62.114H425.854C425.842 63.782 425.812 65.408 425.764 66.992C425.716 68.576 425.59 70.076 425.386 71.492C425.194 72.908 424.87 74.21 424.414 75.398C423.97 76.574 423.352 77.594 422.56 78.458C422.488 78.35 422.392 78.236 422.272 78.116C422.152 78.008 422.026 77.9 421.894 77.792C421.762 77.684 421.636 77.594 421.516 77.522C422.116 76.898 422.602 76.166 422.974 75.326C423.358 74.486 423.658 73.568 423.874 72.572C424.09 71.564 424.24 70.496 424.324 69.368C424.42 68.228 424.474 67.052 424.486 65.84C424.51 64.616 424.522 63.374 424.522 62.114ZM445.888 76.676C446.656 76.64 447.544 76.592 448.552 76.532C449.56 76.472 450.628 76.406 451.756 76.334C452.896 76.25 454.036 76.172 455.176 76.1L455.158 77.306C454.078 77.39 452.992 77.474 451.9 77.558C450.808 77.642 449.764 77.72 448.768 77.792C447.784 77.864 446.89 77.93 446.086 77.99L445.888 76.676ZM452.998 74.588L454.114 74.084C454.426 74.492 454.732 74.93 455.032 75.398C455.344 75.866 455.626 76.328 455.878 76.784C456.13 77.228 456.316 77.63 456.436 77.99L455.248 78.548C455.128 78.188 454.948 77.774 454.708 77.306C454.48 76.85 454.216 76.388 453.916 75.92C453.616 75.44 453.31 74.996 452.998 74.588ZM447.886 70.088V72.554H454.096V70.088H447.886ZM446.698 68.954H455.338V73.688H446.698V68.954ZM448.318 64.004V66.434H453.592V64.004H448.318ZM447.076 62.87H454.87V67.586H447.076V62.87ZM450.28 67.298H451.558V76.82L450.28 76.874V67.298ZM440.632 70.682H444.88V71.906H440.632V70.682ZM444.43 70.682H445.762C445.762 70.682 445.756 70.718 445.744 70.79C445.744 70.862 445.744 70.946 445.744 71.042C445.744 71.126 445.738 71.204 445.726 71.276C445.642 72.74 445.552 73.922 445.456 74.822C445.36 75.71 445.246 76.394 445.114 76.874C444.994 77.342 444.844 77.678 444.664 77.882C444.508 78.062 444.34 78.188 444.16 78.26C443.98 78.332 443.758 78.386 443.494 78.422C443.278 78.434 442.978 78.44 442.594 78.44C442.21 78.44 441.814 78.428 441.406 78.404C441.382 78.212 441.334 77.996 441.262 77.756C441.202 77.528 441.124 77.33 441.028 77.162C441.436 77.198 441.814 77.216 442.162 77.216C442.522 77.228 442.78 77.234 442.936 77.234C443.08 77.234 443.2 77.222 443.296 77.198C443.392 77.174 443.482 77.12 443.566 77.036C443.686 76.904 443.8 76.622 443.908 76.19C444.016 75.746 444.112 75.104 444.196 74.264C444.28 73.412 444.358 72.29 444.43 70.898V70.682ZM440.506 66.956H441.748C441.688 67.58 441.616 68.24 441.532 68.936C441.46 69.62 441.382 70.286 441.298 70.934C441.214 71.582 441.136 72.146 441.064 72.626L439.822 72.464C439.918 71.996 440.008 71.444 440.092 70.808C440.176 70.172 440.254 69.518 440.326 68.846C440.41 68.162 440.47 67.532 440.506 66.956ZM440.83 66.956H444.304V64.058H440.056V62.816H445.564V68.198H440.83V66.956ZM466.408 62.69H473.95V63.914H466.408V62.69ZM459.424 66.866H464.914V68.072H459.424V66.866ZM466.444 67.352H472.888V68.594H466.444V67.352ZM462.088 61.844H463.33V67.586H462.088V61.844ZM465.742 62.69H467.02V67.856C467.02 68.624 466.996 69.464 466.948 70.376C466.912 71.276 466.828 72.2 466.696 73.148C466.564 74.096 466.372 75.026 466.12 75.938C465.88 76.838 465.556 77.666 465.148 78.422C465.076 78.35 464.968 78.266 464.824 78.17C464.68 78.086 464.536 78.002 464.392 77.918C464.26 77.846 464.14 77.792 464.032 77.756C464.416 77.024 464.722 76.238 464.95 75.398C465.19 74.546 465.364 73.682 465.472 72.806C465.592 71.918 465.664 71.054 465.688 70.214C465.724 69.362 465.742 68.576 465.742 67.856V62.69ZM459.478 70.682H463.816V78.422H462.574V71.906H459.478V70.682ZM458.902 62.24H460.108V69.386C460.108 70.166 460.09 70.964 460.054 71.78C460.018 72.584 459.94 73.382 459.82 74.174C459.712 74.966 459.544 75.728 459.316 76.46C459.1 77.18 458.806 77.846 458.434 78.458C458.362 78.374 458.272 78.284 458.164 78.188C458.056 78.092 457.942 77.99 457.822 77.882C457.702 77.786 457.588 77.714 457.48 77.666C457.792 77.078 458.038 76.448 458.218 75.776C458.41 75.104 458.554 74.408 458.65 73.688C458.758 72.968 458.824 72.242 458.848 71.51C458.884 70.778 458.902 70.07 458.902 69.386V62.24ZM472.474 67.352H472.726L472.96 67.316L473.788 67.568C473.5 69.416 473.044 71.048 472.42 72.464C471.808 73.868 471.058 75.068 470.17 76.064C469.282 77.048 468.298 77.84 467.218 78.44C467.158 78.32 467.08 78.194 466.984 78.062C466.888 77.93 466.786 77.798 466.678 77.666C466.57 77.534 466.462 77.426 466.354 77.342C467.35 76.85 468.262 76.154 469.09 75.254C469.93 74.342 470.644 73.244 471.232 71.96C471.82 70.676 472.234 69.23 472.474 67.622V67.352ZM468.334 68.144C468.634 69.572 469.054 70.892 469.594 72.104C470.134 73.316 470.812 74.372 471.628 75.272C472.444 76.16 473.41 76.85 474.526 77.342C474.43 77.426 474.322 77.534 474.202 77.666C474.082 77.798 473.968 77.93 473.86 78.062C473.752 78.206 473.662 78.338 473.59 78.458C472.438 77.882 471.448 77.108 470.62 76.136C469.792 75.164 469.102 74.024 468.55 72.716C467.998 71.408 467.554 69.968 467.218 68.396L468.334 68.144Z"
        fill="var(--highlight)"
      />
      <path
        d="M27.5 125.5C27.5 115.007 36.0066 106.5 46.5 106.5H214.601C225.094 106.5 233.601 115.007 233.601 125.5C233.601 135.993 225.094 144.5 214.601 144.5H46.5C36.0066 144.5 27.5 135.993 27.5 125.5Z"
        fill="var(--highlight)"
        fillOpacity="0.1"
      />
      <path
        d="M61.2361 119.124L65.0935 119.14C67.6651 119.15 69.3189 119.919 70.0548 121.445C70.3195 122.006 70.4502 122.671 70.4471 123.439C70.444 124.207 70.3046 124.864 70.0289 125.41C69.7533 125.956 69.3836 126.403 68.9199 126.753C68.0187 127.426 66.8162 127.76 65.3123 127.754L63.1541 127.745L63.1338 132.725L61.1807 132.718L61.2361 119.124ZM64.9378 126.19C66.1162 126.195 66.9895 125.97 67.5578 125.517C68.126 125.063 68.4121 124.355 68.416 123.391C68.4213 122.109 67.8289 121.28 66.6391 120.904C66.2229 120.772 65.7186 120.705 65.1262 120.702L63.1828 120.694L63.1605 126.183L64.9378 126.19ZM81.9426 132.724C81.2976 132.839 80.4282 132.894 79.3345 132.889C78.2472 132.885 77.2648 132.731 76.3871 132.428C75.5159 132.125 74.7658 131.679 74.1367 131.091C72.7876 129.829 72.1177 128.075 72.1268 125.828C72.1328 124.364 72.4863 123.096 73.1873 122.024C74.1372 120.576 75.5895 119.658 77.5442 119.268C78.1437 119.154 78.8568 119.098 79.6836 119.101C80.5169 119.105 81.1841 119.153 81.685 119.246L81.6774 121.111C81.2222 120.966 80.5162 120.892 79.5591 120.888C78.6086 120.884 77.8009 120.998 77.1359 121.23C76.4708 121.461 75.9194 121.794 75.4814 122.229C74.6055 123.078 74.1644 124.281 74.1581 125.837C74.1517 127.406 74.5763 128.651 75.4319 129.572C76.3589 130.566 77.6948 131.066 79.4395 131.073C80.4617 131.077 81.2986 131.003 81.9502 130.849L81.9426 132.724ZM84.439 119.218L93.687 119.256L93.6801 120.955L86.3852 120.926L86.3689 124.929L92.0036 124.952L91.9969 126.593L86.3622 126.57L86.3368 132.82L84.3837 132.812L84.439 119.218ZM115.211 125.218L116.349 125.702C115.947 126.114 115.459 126.505 114.884 126.876C114.323 127.247 113.721 127.578 113.08 127.869C112.439 128.16 111.798 128.41 111.157 128.621C111.064 128.474 110.931 128.32 110.759 128.159C110.599 127.985 110.453 127.838 110.321 127.718C110.921 127.533 111.529 127.316 112.143 127.065C112.758 126.814 113.332 126.53 113.867 126.212C114.401 125.894 114.849 125.563 115.211 125.218ZM117.123 127.165L118.241 127.63C117.732 128.188 117.11 128.699 116.375 129.162C115.653 129.613 114.858 130.016 113.99 130.373C113.135 130.716 112.254 131.012 111.346 131.262C111.267 131.115 111.154 130.948 111.008 130.76C110.862 130.56 110.716 130.393 110.57 130.259C111.424 130.062 112.265 129.819 113.093 129.529C113.921 129.226 114.683 128.875 115.378 128.478C116.086 128.068 116.668 127.63 117.123 127.165ZM118.974 129.353L120.272 129.918C119.615 130.702 118.772 131.392 117.743 131.988C116.714 132.57 115.559 133.059 114.277 133.454C113.009 133.862 111.668 134.19 110.253 134.437C110.174 134.264 110.061 134.057 109.916 133.816C109.77 133.575 109.624 133.375 109.478 133.214C110.826 133.02 112.107 132.752 113.321 132.41C114.536 132.068 115.631 131.646 116.607 131.143C117.595 130.627 118.385 130.031 118.974 129.353ZM112.588 116.107L113.966 116.472C113.482 117.657 112.87 118.788 112.133 119.865C111.395 120.929 110.625 121.826 109.822 122.556C109.742 122.475 109.629 122.381 109.483 122.274C109.35 122.154 109.21 122.04 109.064 121.932C108.918 121.812 108.785 121.725 108.665 121.671C109.481 120.994 110.231 120.171 110.915 119.2C111.613 118.216 112.17 117.185 112.588 116.107ZM112.139 118.305L120.279 118.338L120.274 119.598L111.374 119.562L112.139 118.305ZM117.538 118.607L118.956 118.933C118.405 120.197 117.667 121.294 116.743 122.224C115.833 123.14 114.776 123.916 113.573 124.551C112.384 125.186 111.095 125.721 109.707 126.155C109.654 126.035 109.575 125.901 109.469 125.754C109.362 125.607 109.25 125.46 109.13 125.313C109.011 125.166 108.911 125.045 108.832 124.952C110.18 124.61 111.422 124.162 112.557 123.607C113.706 123.038 114.702 122.342 115.546 121.519C116.403 120.696 117.067 119.725 117.538 118.607ZM111.996 119.084C112.406 119.886 113.003 120.669 113.786 121.432C114.583 122.195 115.574 122.872 116.758 123.464C117.956 124.055 119.334 124.501 120.893 124.801C120.799 124.894 120.698 125.013 120.591 125.159C120.484 125.306 120.383 125.452 120.289 125.598C120.195 125.745 120.115 125.884 120.048 126.017C118.489 125.651 117.118 125.139 115.934 124.48C114.75 123.822 113.753 123.092 112.943 122.288C112.133 121.472 111.503 120.649 111.053 119.821L111.996 119.084ZM107.478 118.486L108.818 118.491L108.766 131.191L107.426 131.186L107.478 118.486ZM105.947 116.22L107.326 116.605C106.948 117.764 106.496 118.909 105.972 120.04C105.461 121.171 104.896 122.236 104.279 123.233C103.675 124.231 103.044 125.121 102.388 125.905C102.348 125.785 102.282 125.632 102.19 125.445C102.097 125.244 101.998 125.05 101.892 124.863C101.786 124.663 101.694 124.496 101.614 124.362C102.19 123.698 102.747 122.933 103.284 122.069C103.834 121.191 104.331 120.253 104.775 119.255C105.232 118.257 105.623 117.245 105.947 116.22ZM104.327 121.093L105.713 119.719L105.753 119.759L105.693 134.499L104.273 134.493L104.327 121.093ZM122.004 126.785C122.578 126.654 123.226 126.49 123.946 126.293C124.667 126.096 125.435 125.879 126.249 125.643C127.064 125.392 127.878 125.149 128.692 124.912L128.907 126.293C127.785 126.649 126.65 126.997 125.502 127.339C124.367 127.682 123.34 127.991 122.418 128.267L122.004 126.785ZM122.351 120.207L128.811 120.233L128.805 121.673L122.345 121.647L122.351 120.207ZM125.048 116.198L126.508 116.203L126.44 132.703C126.439 133.117 126.384 133.443 126.276 133.683C126.182 133.922 126.001 134.102 125.734 134.22C125.48 134.339 125.14 134.411 124.713 134.436C124.3 134.475 123.76 134.492 123.093 134.49C123.054 134.29 122.995 134.049 122.916 133.769C122.837 133.502 122.745 133.262 122.639 133.048C123.092 133.063 123.506 133.071 123.879 133.073C124.252 133.074 124.499 133.069 124.619 133.056C124.752 133.056 124.846 133.03 124.899 132.977C124.953 132.937 124.98 132.844 124.98 132.697L125.048 116.198ZM131.212 124.843L139.052 124.875L139.047 126.295L131.207 126.263L131.212 124.843ZM131.174 119.663L139.773 119.698L139.741 127.557L138.241 127.551L138.268 121.051L131.168 121.023L131.174 119.663ZM130.214 119.659L131.714 119.665L131.692 125.045C131.689 125.778 131.652 126.571 131.582 127.424C131.512 128.264 131.375 129.117 131.172 129.983C130.981 130.835 130.698 131.661 130.321 132.459C129.958 133.258 129.475 133.982 128.873 134.633C128.793 134.526 128.68 134.406 128.534 134.272C128.388 134.138 128.235 134.004 128.076 133.87C127.93 133.736 127.797 133.636 127.677 133.568C128.239 132.957 128.682 132.299 129.005 131.594C129.341 130.875 129.591 130.136 129.754 129.377C129.93 128.618 130.047 127.871 130.103 127.138C130.159 126.392 130.189 125.679 130.192 124.999L130.214 119.659ZM133.105 116.79L134.447 116.276C134.832 116.717 135.204 117.199 135.561 117.72C135.919 118.242 136.184 118.696 136.356 119.084L134.953 119.698C134.782 119.284 134.524 118.809 134.179 118.275C133.835 117.74 133.477 117.245 133.105 116.79ZM144.927 116.319L146.307 116.324L146.233 134.624L144.853 134.618L144.927 116.319ZM142.08 122.967L148.52 122.993L148.514 124.393L142.074 124.367L142.08 122.967ZM144.817 123.718L145.776 124.122C145.613 124.801 145.416 125.514 145.187 126.26C144.957 126.992 144.701 127.724 144.418 128.457C144.148 129.189 143.859 129.874 143.549 130.513C143.24 131.152 142.925 131.697 142.603 132.149C142.563 131.989 142.497 131.822 142.405 131.648C142.312 131.461 142.213 131.281 142.107 131.107C142.001 130.92 141.908 130.76 141.829 130.626C142.218 130.108 142.607 129.456 142.997 128.671C143.387 127.872 143.744 127.04 144.067 126.175C144.391 125.296 144.641 124.477 144.817 123.718ZM146.233 124.764C146.352 124.924 146.531 125.178 146.77 125.526C147.022 125.874 147.287 126.255 147.565 126.669C147.857 127.071 148.122 127.452 148.36 127.813C148.599 128.16 148.765 128.421 148.857 128.595L147.833 129.73C147.74 129.463 147.588 129.136 147.377 128.749C147.178 128.348 146.953 127.927 146.702 127.486C146.464 127.045 146.232 126.637 146.007 126.263C145.795 125.875 145.623 125.575 145.49 125.361L146.233 124.764ZM142.301 117.808L143.342 117.552C143.527 118.006 143.698 118.5 143.856 119.034C144.014 119.568 144.145 120.089 144.25 120.596C144.368 121.09 144.446 121.537 144.484 121.937L143.383 122.192C143.358 121.806 143.287 121.359 143.169 120.851C143.064 120.344 142.933 119.824 142.775 119.29C142.631 118.756 142.473 118.262 142.301 117.808ZM147.843 117.49L149.101 117.816C148.939 118.308 148.764 118.828 148.575 119.373C148.386 119.919 148.197 120.445 148.008 120.951C147.833 121.457 147.658 121.896 147.483 122.269L146.544 121.965C146.706 121.579 146.868 121.12 147.03 120.587C147.192 120.054 147.348 119.515 147.497 118.969C147.645 118.423 147.761 117.93 147.843 117.49ZM149.801 117.898L159.961 117.94L159.956 119.1L149.796 119.058L149.801 117.898ZM150.291 120.3L159.511 120.338L159.507 121.438L150.287 121.4L150.291 120.3ZM149.221 122.736L160.461 122.782L160.456 123.962L149.216 123.916L149.221 122.736ZM154.007 116.296L155.427 116.301L155.399 123.401L153.979 123.395L154.007 116.296ZM150.451 125.121L158.151 125.152L158.147 126.292L151.887 126.267L151.853 134.667L150.413 134.661L150.451 125.121ZM157.711 125.151L159.111 125.156L159.079 133.156C159.077 133.516 159.03 133.796 158.935 133.996C158.855 134.209 158.681 134.368 158.413 134.474C158.146 134.579 157.799 134.638 157.373 134.649C156.946 134.674 156.419 134.685 155.793 134.683C155.767 134.496 155.708 134.283 155.615 134.042C155.536 133.815 155.45 133.608 155.358 133.421C155.811 133.436 156.224 133.445 156.598 133.446C156.971 133.461 157.218 133.462 157.338 133.449C157.471 133.45 157.558 133.423 157.598 133.37C157.651 133.33 157.678 133.257 157.679 133.151L157.711 125.151ZM151.201 127.764L158.261 127.793L158.256 128.873L151.196 128.844L151.201 127.764ZM151.19 130.344L158.25 130.373L158.246 131.433L151.186 131.404L151.19 130.344ZM178.402 117.735L179.537 118.88C178.642 119.436 177.613 119.952 176.451 120.427C175.289 120.902 174.06 121.344 172.765 121.752C171.484 122.147 170.216 122.502 168.961 122.816C168.922 122.643 168.843 122.443 168.723 122.215C168.618 121.975 168.512 121.775 168.406 121.614C169.327 121.378 170.261 121.122 171.209 120.846C172.157 120.556 173.072 120.247 173.953 119.917C174.834 119.574 175.656 119.224 176.417 118.867C177.179 118.497 177.84 118.119 178.402 117.735ZM171.886 116.648L173.386 116.654L173.357 123.774C173.356 124.094 173.422 124.308 173.555 124.415C173.687 124.509 173.987 124.557 174.454 124.559C174.561 124.559 174.761 124.56 175.054 124.561C175.347 124.562 175.674 124.564 176.034 124.565C176.394 124.567 176.727 124.568 177.034 124.569C177.354 124.571 177.581 124.572 177.714 124.572C177.981 124.573 178.174 124.521 178.295 124.415C178.428 124.295 178.523 124.075 178.577 123.756C178.645 123.436 178.694 122.969 178.723 122.356C178.896 122.477 179.109 122.591 179.362 122.699C179.628 122.807 179.861 122.888 180.061 122.942C180.004 123.701 179.902 124.301 179.753 124.74C179.605 125.167 179.384 125.466 179.09 125.638C178.796 125.81 178.375 125.895 177.829 125.893C177.749 125.892 177.589 125.892 177.349 125.891C177.109 125.89 176.829 125.889 176.509 125.887C176.202 125.886 175.895 125.885 175.589 125.883C175.282 125.882 175.009 125.881 174.769 125.88C174.542 125.879 174.389 125.879 174.309 125.878C173.655 125.876 173.149 125.814 172.789 125.692C172.443 125.571 172.197 125.356 172.052 125.049C171.92 124.742 171.855 124.315 171.857 123.768L171.886 116.648ZM167.788 116.312L169.185 116.817C168.702 117.615 168.139 118.393 167.496 119.15C166.853 119.908 166.17 120.618 165.447 121.282C164.738 121.933 164.022 122.503 163.3 122.993C163.221 122.9 163.114 122.786 162.982 122.652C162.849 122.505 162.709 122.364 162.563 122.23C162.431 122.083 162.304 121.963 162.185 121.869C162.92 121.432 163.629 120.921 164.311 120.338C164.993 119.754 165.636 119.123 166.239 118.445C166.842 117.754 167.358 117.043 167.788 116.312ZM165.734 119.583L166.819 118.508L167.238 118.629L167.206 126.409L165.706 126.403L165.734 119.583ZM170.447 126.383L172.026 126.389L171.992 134.769L170.412 134.762L170.447 126.383ZM162.277 128.689L180.217 128.762L180.211 130.222L162.271 130.149L162.277 128.689ZM194.091 125.279L194.894 124.682C195.252 124.99 195.604 125.345 195.949 125.746C196.308 126.148 196.573 126.502 196.745 126.81L195.922 127.526C195.75 127.206 195.492 126.838 195.147 126.423C194.802 125.995 194.45 125.614 194.091 125.279ZM187.198 118.631L200.418 118.685L200.412 120.125L187.192 120.071L187.198 118.631ZM193.641 122.817L198.641 122.837L198.636 124.057L193.636 124.037L193.641 122.817ZM192.887 116.434L194.387 116.44L194.376 119.3L192.876 119.294L192.887 116.434ZM189.851 120.342L191.27 120.747C190.946 121.573 190.563 122.431 190.119 123.323C189.676 124.201 189.185 125.052 188.649 125.877C188.112 126.688 187.542 127.412 186.94 128.05C186.82 127.903 186.661 127.742 186.462 127.568C186.263 127.38 186.09 127.226 185.944 127.106C186.506 126.508 187.036 125.83 187.532 125.072C188.042 124.301 188.492 123.509 188.882 122.698C189.285 121.873 189.608 121.087 189.851 120.342ZM193.911 120.398L195.31 120.744C195.013 121.609 194.643 122.501 194.199 123.419C193.768 124.324 193.278 125.196 192.728 126.033C192.191 126.858 191.608 127.595 190.979 128.246C190.86 128.099 190.7 127.932 190.501 127.744C190.315 127.557 190.149 127.409 190.003 127.302C190.605 126.705 191.155 126.02 191.651 125.249C192.161 124.464 192.604 123.653 192.981 122.814C193.371 121.976 193.681 121.17 193.911 120.398ZM198.341 122.836L198.601 122.837L198.842 122.758L199.76 123.102C199.352 125.167 198.724 126.964 197.878 128.494C197.032 130.024 196.033 131.313 194.882 132.362C193.731 133.397 192.475 134.226 191.112 134.847C191.02 134.686 190.887 134.493 190.715 134.265C190.542 134.038 190.383 133.857 190.237 133.723C191.506 133.195 192.689 132.447 193.786 131.478C194.883 130.495 195.828 129.306 196.621 127.909C197.413 126.512 197.986 124.915 198.34 123.116L198.341 122.836ZM182.982 117.654L183.846 116.597C184.232 116.772 184.625 116.98 185.024 117.222C185.436 117.464 185.822 117.712 186.181 117.967C186.553 118.221 186.852 118.463 187.078 118.69L186.153 119.886C185.941 119.646 185.655 119.398 185.296 119.143C184.951 118.875 184.572 118.613 184.159 118.358C183.76 118.09 183.368 117.855 182.982 117.654ZM182.04 123.09L182.884 121.993C183.257 122.141 183.65 122.323 184.062 122.538C184.488 122.74 184.881 122.955 185.24 123.183C185.612 123.398 185.911 123.612 186.137 123.826L185.252 125.043C185.04 124.829 184.754 124.601 184.395 124.359C184.036 124.118 183.65 123.89 183.238 123.675C182.825 123.446 182.426 123.251 182.04 123.09ZM182.436 133.851C182.705 133.319 182.994 132.7 183.304 131.995C183.627 131.29 183.95 130.544 184.273 129.759C184.596 128.974 184.893 128.201 185.162 127.443L186.359 128.307C186.129 128.986 185.866 129.705 185.57 130.464C185.274 131.21 184.971 131.948 184.661 132.681C184.365 133.399 184.075 134.071 183.793 134.697L182.436 133.851ZM193.112 124.975C193.547 126.283 194.129 127.506 194.858 128.642C195.586 129.778 196.449 130.775 197.445 131.633C198.442 132.49 199.532 133.168 200.717 133.666C200.61 133.745 200.496 133.858 200.376 134.005C200.255 134.151 200.135 134.29 200.014 134.423C199.907 134.569 199.813 134.709 199.732 134.842C197.909 133.981 196.334 132.721 195.008 131.063C193.681 129.391 192.656 127.473 191.931 125.31L193.112 124.975ZM188.535 124.316L189.84 123.042L189.88 123.062L189.832 134.822L188.492 134.816L188.535 124.316Z"
        fill="var(--highlight)"
      />
      <path
        d="M473.5 180.5C473.5 168.902 482.902 159.5 494.5 159.5H606.5C618.098 159.5 627.5 168.902 627.5 180.5C627.5 192.098 618.098 201.5 606.5 201.5H494.5C482.902 201.5 473.5 192.098 473.5 180.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M506.652 175.076H514.748V176.212H507.964V180.036H514.364V181.172H507.964V185.364H515.02V186.5H506.652V175.076ZM520.12 178.004C521.352 178.004 522.264 178.532 522.872 179.588V178.228H524.072V189.668H522.792V184.996C522.152 186.148 521.24 186.724 520.056 186.724C518.872 186.724 517.944 186.276 517.272 185.412C516.664 184.612 516.36 183.604 516.36 182.388C516.36 181.14 516.664 180.132 517.288 179.332C517.96 178.436 518.904 178.004 520.12 178.004ZM520.28 179.06C519.384 179.06 518.712 179.38 518.264 180.052C517.864 180.628 517.672 181.412 517.672 182.388C517.672 183.38 517.88 184.164 518.296 184.74C518.744 185.348 519.432 185.668 520.328 185.668C521.064 185.668 521.672 185.364 522.136 184.788C522.584 184.196 522.824 183.428 522.824 182.468V182.308C522.824 181.38 522.616 180.612 522.216 180.036C521.752 179.38 521.112 179.06 520.28 179.06ZM526.055 178.228H527.335V183.284C527.335 184.068 527.495 184.66 527.831 185.044C528.167 185.428 528.711 185.636 529.463 185.636C530.007 185.636 530.503 185.412 530.935 184.996C531.383 184.548 531.655 183.972 531.751 183.268V178.228H533.031V186.5H531.751V185.22C531.079 186.212 530.183 186.724 529.062 186.724C527.047 186.724 526.055 185.588 526.055 183.348V178.228ZM538.608 178.004C539.792 178.004 540.656 178.308 541.232 178.932C541.712 179.476 541.968 180.228 541.968 181.188V186.5H540.768V185.108C540.448 185.556 540.016 185.924 539.504 186.212C538.896 186.548 538.208 186.724 537.44 186.724C536.608 186.724 535.952 186.516 535.456 186.1C534.944 185.668 534.688 185.108 534.688 184.436C534.688 183.492 535.056 182.788 535.824 182.308C536.496 181.86 537.456 181.62 538.704 181.604L540.688 181.572V181.14C540.688 179.748 539.968 179.06 538.528 179.06C537.92 179.06 537.424 179.172 537.04 179.428C536.608 179.684 536.336 180.084 536.208 180.612L534.944 180.516C535.12 179.652 535.552 178.996 536.224 178.58C536.832 178.196 537.616 178.004 538.608 178.004ZM540.688 182.532L538.784 182.564C536.928 182.596 536 183.204 536 184.404C536 184.788 536.144 185.092 536.464 185.348C536.784 185.588 537.2 185.716 537.712 185.716C538.496 185.716 539.184 185.46 539.792 184.948C540.384 184.452 540.688 183.876 540.688 183.236V182.532ZM544.201 174.852H545.465V186.5H544.201V174.852ZM548.767 175.108C549.039 175.108 549.263 175.188 549.455 175.38C549.647 175.54 549.743 175.764 549.743 176.052C549.743 176.324 549.647 176.548 549.455 176.74C549.263 176.916 549.039 177.012 548.767 177.012C548.495 177.012 548.271 176.916 548.079 176.74C547.887 176.548 547.807 176.324 547.807 176.052C547.807 175.764 547.887 175.54 548.079 175.38C548.271 175.188 548.495 175.108 548.767 175.108ZM548.127 178.228H549.407V186.5H548.127V178.228ZM551.373 178.228H557.949V179.124L552.877 185.428H558.205V186.5H551.213V185.572L556.269 179.3H551.373V178.228ZM563.009 178.004C564.337 178.004 565.345 178.452 566.017 179.348C566.625 180.148 566.945 181.284 566.977 182.724H560.449C560.513 183.652 560.753 184.372 561.201 184.884C561.649 185.396 562.273 185.652 563.057 185.652C563.729 185.652 564.289 185.476 564.705 185.14C565.057 184.852 565.329 184.42 565.537 183.844H566.817C566.625 184.644 566.257 185.284 565.697 185.796C565.009 186.404 564.129 186.724 563.057 186.724C561.873 186.724 560.913 186.324 560.209 185.556C559.473 184.756 559.121 183.7 559.121 182.356C559.121 181.14 559.457 180.116 560.161 179.3C560.865 178.436 561.809 178.004 563.009 178.004ZM563.041 179.076C562.305 179.076 561.713 179.316 561.265 179.796C560.817 180.276 560.561 180.916 560.481 181.732H565.649C565.489 179.956 564.609 179.076 563.041 179.076ZM572.108 178.004C572.556 178.004 572.94 178.068 573.244 178.196V179.476C572.828 179.348 572.412 179.3 572.012 179.3C571.372 179.3 570.828 179.572 570.396 180.148C569.948 180.692 569.74 181.348 569.74 182.116V186.5H568.476V178.228H569.74V179.668C569.964 179.188 570.252 178.804 570.604 178.532C571.036 178.18 571.532 178.004 572.108 178.004ZM582.336 175.076H583.36V186.5H582.048V176.676C581.328 177.412 580.432 177.924 579.36 178.244V176.932C579.872 176.788 580.416 176.564 580.96 176.244C581.504 175.892 581.952 175.508 582.336 175.076ZM589.878 174.852C591.238 174.852 592.262 175.444 592.966 176.66C593.574 177.684 593.878 179.06 593.878 180.788C593.878 182.516 593.574 183.892 592.966 184.916C592.262 186.116 591.238 186.724 589.878 186.724C588.502 186.724 587.478 186.116 586.79 184.916C586.182 183.892 585.878 182.516 585.878 180.788C585.878 179.06 586.182 177.684 586.79 176.66C587.478 175.444 588.502 174.852 589.878 174.852ZM589.878 175.972C588.854 175.972 588.118 176.516 587.67 177.62C587.35 178.388 587.19 179.444 587.19 180.788C587.19 182.116 587.35 183.172 587.67 183.956C588.118 185.044 588.854 185.604 589.878 185.604C590.902 185.604 591.638 185.044 592.086 183.956C592.406 183.172 592.582 182.116 592.582 180.788C592.582 179.444 592.406 178.388 592.086 177.62C591.638 176.516 590.902 175.972 589.878 175.972Z"
        fill="var(--text-secondary)"
      />
      <path
        d="M264.5 126.5C264.5 117.663 271.663 110.5 280.5 110.5H354.5C363.337 110.5 370.5 117.663 370.5 126.5C370.5 135.337 363.337 142.5 354.5 142.5H280.5C271.663 142.5 264.5 135.337 264.5 126.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M304.606 120.02L305.586 120.146C305.46 120.51 305.306 120.86 305.138 121.196H309.142V122.064C308.68 122.988 307.98 123.786 307.042 124.458C307.854 124.822 308.792 125.13 309.87 125.382L309.478 126.32C308.12 125.984 306.986 125.564 306.076 125.06C305.096 125.592 303.934 126.026 302.576 126.362L302.198 125.452C303.332 125.186 304.326 124.85 305.166 124.458C304.578 124.01 304.102 123.506 303.766 122.974C303.472 123.254 303.164 123.506 302.828 123.758L302.254 123.002C303.402 122.19 304.186 121.196 304.606 120.02ZM304.396 122.302C304.788 122.932 305.348 123.478 306.09 123.954C306.93 123.422 307.574 122.82 308.05 122.12H304.536C304.48 122.176 304.438 122.246 304.396 122.302ZM300.028 120.048L300.924 120.468C300.588 121.518 300.182 122.512 299.692 123.436V132.914H298.726V125.032C298.292 125.662 297.816 126.264 297.298 126.824L297.004 125.816C298.39 124.136 299.398 122.218 300.028 120.048ZM300.938 122.526H301.848V130.45H300.938V122.526ZM306.538 125.97L307.266 126.432C306.734 126.88 306.202 127.244 305.656 127.538C305.068 127.846 304.298 128.154 303.346 128.462L302.856 127.664C303.64 127.468 304.354 127.23 304.998 126.936C305.558 126.656 306.062 126.334 306.538 125.97ZM307.868 127.006L308.54 127.524C307.42 128.924 305.782 129.918 303.612 130.534L303.206 129.68C305.278 129.134 306.832 128.238 307.868 127.006ZM303.052 132.998L302.632 132.074C304.228 131.654 305.516 131.15 306.51 130.562C307.504 129.988 308.358 129.232 309.058 128.308L309.772 128.84C309.156 129.806 308.218 130.66 306.958 131.388C305.698 132.088 304.396 132.634 303.052 132.998ZM311.368 120.79H323.632V121.77H311.368V120.79ZM315.526 132.872H314.476L314.224 131.948L315.218 131.99C315.554 131.99 315.736 131.794 315.736 131.43V124.178H312.936V132.914H312.012V123.226H316.674V131.626C316.674 132.452 316.282 132.872 315.526 132.872ZM313.958 125.676C314.546 126.656 315.064 127.706 315.484 128.812L314.672 129.162C314.224 127.944 313.734 126.88 313.202 125.984L313.958 125.676ZM321.784 132.872H320.818L320.566 131.948L321.476 131.99C321.854 131.99 322.05 131.794 322.05 131.402V124.178H319.236V132.914H318.298V123.226H322.974V131.598C322.974 132.438 322.568 132.872 321.784 132.872ZM320.244 125.662C320.846 126.67 321.364 127.734 321.798 128.854L320.986 129.204C320.538 127.972 320.034 126.894 319.488 125.97L320.244 125.662ZM325.27 120.902H337.758V121.882H335.91V131.402C335.91 132.326 335.462 132.802 334.566 132.802H332.228L332.004 131.822C332.774 131.85 333.516 131.878 334.216 131.878C334.664 131.878 334.902 131.626 334.902 131.15V121.882H325.27V120.902ZM332.34 124.024V129.162H327.874V130.394H326.894V124.024H332.34ZM327.874 128.238H331.374V124.934H327.874V128.238Z"
        fill="var(--text-secondary)"
        fillOpacity="0.5"
      />
      <path
        d="M555.5 83.5C555.5 71.902 564.902 62.5 576.5 62.5H688.5C700.098 62.5 709.5 71.902 709.5 83.5C709.5 95.098 700.098 104.5 688.5 104.5H576.5C564.902 104.5 555.5 95.098 555.5 83.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M588.652 78.076H596.748V79.212H589.964V83.036H596.364V84.172H589.964V88.364H597.02V89.5H588.652V78.076ZM602.12 81.004C603.352 81.004 604.264 81.532 604.872 82.588V81.228H606.072V92.668H604.792V87.996C604.152 89.148 603.24 89.724 602.056 89.724C600.872 89.724 599.944 89.276 599.272 88.412C598.664 87.612 598.36 86.604 598.36 85.388C598.36 84.14 598.664 83.132 599.288 82.332C599.96 81.436 600.904 81.004 602.12 81.004ZM602.28 82.06C601.384 82.06 600.712 82.38 600.264 83.052C599.864 83.628 599.672 84.412 599.672 85.388C599.672 86.38 599.88 87.164 600.296 87.74C600.744 88.348 601.432 88.668 602.328 88.668C603.064 88.668 603.672 88.364 604.136 87.788C604.584 87.196 604.824 86.428 604.824 85.468V85.308C604.824 84.38 604.616 83.612 604.216 83.036C603.752 82.38 603.112 82.06 602.28 82.06ZM608.055 81.228H609.335V86.284C609.335 87.068 609.495 87.66 609.831 88.044C610.167 88.428 610.711 88.636 611.463 88.636C612.007 88.636 612.503 88.412 612.935 87.996C613.383 87.548 613.655 86.972 613.751 86.268V81.228H615.031V89.5H613.751V88.22C613.079 89.212 612.183 89.724 611.062 89.724C609.047 89.724 608.055 88.588 608.055 86.348V81.228ZM620.608 81.004C621.792 81.004 622.656 81.308 623.232 81.932C623.712 82.476 623.968 83.228 623.968 84.188V89.5H622.768V88.108C622.448 88.556 622.016 88.924 621.504 89.212C620.896 89.548 620.208 89.724 619.44 89.724C618.608 89.724 617.952 89.516 617.456 89.1C616.944 88.668 616.688 88.108 616.688 87.436C616.688 86.492 617.056 85.788 617.824 85.308C618.496 84.86 619.456 84.62 620.704 84.604L622.688 84.572V84.14C622.688 82.748 621.968 82.06 620.528 82.06C619.92 82.06 619.424 82.172 619.04 82.428C618.608 82.684 618.336 83.084 618.208 83.612L616.944 83.516C617.12 82.652 617.552 81.996 618.224 81.58C618.832 81.196 619.616 81.004 620.608 81.004ZM622.688 85.532L620.784 85.564C618.928 85.596 618 86.204 618 87.404C618 87.788 618.144 88.092 618.464 88.348C618.784 88.588 619.2 88.716 619.712 88.716C620.496 88.716 621.184 88.46 621.792 87.948C622.384 87.452 622.688 86.876 622.688 86.236V85.532ZM626.201 77.852H627.465V89.5H626.201V77.852ZM630.767 78.108C631.039 78.108 631.263 78.188 631.455 78.38C631.647 78.54 631.743 78.764 631.743 79.052C631.743 79.324 631.647 79.548 631.455 79.74C631.263 79.916 631.039 80.012 630.767 80.012C630.495 80.012 630.271 79.916 630.079 79.74C629.887 79.548 629.807 79.324 629.807 79.052C629.807 78.764 629.887 78.54 630.079 78.38C630.271 78.188 630.495 78.108 630.767 78.108ZM630.127 81.228H631.407V89.5H630.127V81.228ZM633.373 81.228H639.949V82.124L634.877 88.428H640.205V89.5H633.213V88.572L638.269 82.3H633.373V81.228ZM645.009 81.004C646.337 81.004 647.345 81.452 648.017 82.348C648.625 83.148 648.945 84.284 648.977 85.724H642.449C642.513 86.652 642.753 87.372 643.201 87.884C643.649 88.396 644.273 88.652 645.057 88.652C645.729 88.652 646.289 88.476 646.705 88.14C647.057 87.852 647.329 87.42 647.537 86.844H648.817C648.625 87.644 648.257 88.284 647.697 88.796C647.009 89.404 646.129 89.724 645.057 89.724C643.873 89.724 642.913 89.324 642.209 88.556C641.473 87.756 641.121 86.7 641.121 85.356C641.121 84.14 641.457 83.116 642.161 82.3C642.865 81.436 643.809 81.004 645.009 81.004ZM645.041 82.076C644.305 82.076 643.713 82.316 643.265 82.796C642.817 83.276 642.561 83.916 642.481 84.732H647.649C647.489 82.956 646.609 82.076 645.041 82.076ZM654.108 81.004C654.556 81.004 654.94 81.068 655.244 81.196V82.476C654.828 82.348 654.412 82.3 654.012 82.3C653.372 82.3 652.828 82.572 652.396 83.148C651.948 83.692 651.74 84.348 651.74 85.116V89.5H650.476V81.228H651.74V82.668C651.964 82.188 652.252 81.804 652.604 81.532C653.036 81.18 653.532 81.004 654.108 81.004ZM664.336 78.076H665.36V89.5H664.048V79.676C663.328 80.412 662.432 80.924 661.36 81.244V79.932C661.872 79.788 662.416 79.564 662.96 79.244C663.504 78.892 663.952 78.508 664.336 78.076ZM671.878 77.852C673.238 77.852 674.262 78.444 674.966 79.66C675.574 80.684 675.878 82.06 675.878 83.788C675.878 85.516 675.574 86.892 674.966 87.916C674.262 89.116 673.238 89.724 671.878 89.724C670.502 89.724 669.478 89.116 668.79 87.916C668.182 86.892 667.878 85.516 667.878 83.788C667.878 82.06 668.182 80.684 668.79 79.66C669.478 78.444 670.502 77.852 671.878 77.852ZM671.878 78.972C670.854 78.972 670.118 79.516 669.67 80.62C669.35 81.388 669.19 82.444 669.19 83.788C669.19 85.116 669.35 86.172 669.67 86.956C670.118 88.044 670.854 88.604 671.878 88.604C672.902 88.604 673.638 88.044 674.086 86.956C674.406 86.172 674.582 85.116 674.582 83.788C674.582 82.444 674.406 81.388 674.086 80.62C673.638 79.516 672.902 78.972 671.878 78.972Z"
        fill="var(--text-secondary)"
      />
      <path
        d="M599.5 138.5C599.5 129.663 606.663 122.5 615.5 122.5H689.5C698.337 122.5 705.5 129.663 705.5 138.5C705.5 147.337 698.337 154.5 689.5 154.5H615.5C606.663 154.5 599.5 147.337 599.5 138.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M639.606 132.02L640.586 132.146C640.46 132.51 640.306 132.86 640.138 133.196H644.142V134.064C643.68 134.988 642.98 135.786 642.042 136.458C642.854 136.822 643.792 137.13 644.87 137.382L644.478 138.32C643.12 137.984 641.986 137.564 641.076 137.06C640.096 137.592 638.934 138.026 637.576 138.362L637.198 137.452C638.332 137.186 639.326 136.85 640.166 136.458C639.578 136.01 639.102 135.506 638.766 134.974C638.472 135.254 638.164 135.506 637.828 135.758L637.254 135.002C638.402 134.19 639.186 133.196 639.606 132.02ZM639.396 134.302C639.788 134.932 640.348 135.478 641.09 135.954C641.93 135.422 642.574 134.82 643.05 134.12H639.536C639.48 134.176 639.438 134.246 639.396 134.302ZM635.028 132.048L635.924 132.468C635.588 133.518 635.182 134.512 634.692 135.436V144.914H633.726V137.032C633.292 137.662 632.816 138.264 632.298 138.824L632.004 137.816C633.39 136.136 634.398 134.218 635.028 132.048ZM635.938 134.526H636.848V142.45H635.938V134.526ZM641.538 137.97L642.266 138.432C641.734 138.88 641.202 139.244 640.656 139.538C640.068 139.846 639.298 140.154 638.346 140.462L637.856 139.664C638.64 139.468 639.354 139.23 639.998 138.936C640.558 138.656 641.062 138.334 641.538 137.97ZM642.868 139.006L643.54 139.524C642.42 140.924 640.782 141.918 638.612 142.534L638.206 141.68C640.278 141.134 641.832 140.238 642.868 139.006ZM638.052 144.998L637.632 144.074C639.228 143.654 640.516 143.15 641.51 142.562C642.504 141.988 643.358 141.232 644.058 140.308L644.772 140.84C644.156 141.806 643.218 142.66 641.958 143.388C640.698 144.088 639.396 144.634 638.052 144.998ZM646.368 132.79H658.632V133.77H646.368V132.79ZM650.526 144.872H649.476L649.224 143.948L650.218 143.99C650.554 143.99 650.736 143.794 650.736 143.43V136.178H647.936V144.914H647.012V135.226H651.674V143.626C651.674 144.452 651.282 144.872 650.526 144.872ZM648.958 137.676C649.546 138.656 650.064 139.706 650.484 140.812L649.672 141.162C649.224 139.944 648.734 138.88 648.202 137.984L648.958 137.676ZM656.784 144.872H655.818L655.566 143.948L656.476 143.99C656.854 143.99 657.05 143.794 657.05 143.402V136.178H654.236V144.914H653.298V135.226H657.974V143.598C657.974 144.438 657.568 144.872 656.784 144.872ZM655.244 137.662C655.846 138.67 656.364 139.734 656.798 140.854L655.986 141.204C655.538 139.972 655.034 138.894 654.488 137.97L655.244 137.662ZM660.27 132.902H672.758V133.882H670.91V143.402C670.91 144.326 670.462 144.802 669.566 144.802H667.228L667.004 143.822C667.774 143.85 668.516 143.878 669.216 143.878C669.664 143.878 669.902 143.626 669.902 143.15V133.882H660.27V132.902ZM667.34 136.024V141.162H662.874V142.394H661.894V136.024H667.34ZM662.874 140.238H666.374V136.934H662.874V140.238Z"
        fill="var(--text-secondary)"
        fillOpacity="0.5"
      />
      <path
        d="M54.5 175.5C54.5 166.663 61.6634 159.5 70.5 159.5H144.5C153.337 159.5 160.5 166.663 160.5 175.5C160.5 184.337 153.337 191.5 144.5 191.5H70.5C61.6634 191.5 54.5 184.337 54.5 175.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M96.3 177.672L96.244 177.91C95.838 179.548 94.914 180.892 93.472 181.942L92.828 181.186C94.06 180.262 94.886 179.114 95.292 177.742C95.6 176.566 95.754 175.096 95.768 173.304H96.706C96.706 174.284 96.65 175.18 96.566 176.006C97.238 178.134 98.358 179.814 99.94 181.074L99.268 181.858C97.98 180.71 96.986 179.324 96.3 177.672ZM89.594 172.03C90.154 172.842 90.686 173.668 91.19 174.48C91.526 173.612 91.806 172.674 92.002 171.666L92.912 171.82C92.632 173.164 92.254 174.382 91.778 175.474C92.31 176.426 92.814 177.364 93.262 178.302L92.562 178.988C92.184 178.162 91.764 177.322 91.288 176.468C90.714 177.518 90.042 178.428 89.286 179.184L88.698 178.456C89.51 177.616 90.196 176.636 90.742 175.516C90.182 174.578 89.58 173.626 88.922 172.66L89.594 172.03ZM87.578 169.944H93.122V170.868H88.516V179.912H93.052V180.878H87.578V169.944ZM94.732 169.076L95.698 169.23C95.6 169.944 95.488 170.602 95.348 171.218H99.464V171.848C99.24 173.024 98.932 174.172 98.54 175.292L97.56 175.012C97.91 174.172 98.204 173.22 98.428 172.156H95.11C94.76 173.36 94.298 174.326 93.738 175.082L92.926 174.508C93.85 173.206 94.452 171.4 94.732 169.076ZM101.452 170.826H104.112V169.202H105.148V170.826H107.682V171.806H105.148V173.64H107.36V174.606H105.148V174.928C105.134 175.516 105.092 176.076 105.022 176.608H107.668V177.588H104.826C104.378 179.366 103.482 180.752 102.138 181.732L101.34 181.046C102.516 180.206 103.328 179.058 103.748 177.588H101.228V176.608H103.972C104.056 176.062 104.098 175.502 104.112 174.928V174.606H101.746V173.64H104.112V171.806H101.452V170.826ZM108.634 169.692H113.478V170.476C113.002 171.918 112.484 173.262 111.924 174.494C113.086 175.782 113.674 176.832 113.688 177.658C113.688 178.554 113.492 179.184 113.128 179.548C112.736 179.912 111.952 180.094 110.748 180.094L110.44 179.044C110.804 179.072 111.126 179.1 111.392 179.1C111.952 179.072 112.316 178.974 112.47 178.778C112.61 178.582 112.694 178.204 112.708 177.658C112.694 176.846 112.078 175.796 110.874 174.494C111.392 173.402 111.896 172.128 112.386 170.644H109.614V181.914H108.634V169.692ZM115.48 174.55H117.034V171.134H115.228V170.154H119.694V171.134H118.042V174.55H119.582V175.516H118.042V178.834C118.574 178.666 119.106 178.498 119.624 178.316V179.282C118.28 179.786 116.824 180.206 115.27 180.542L115.018 179.534C115.704 179.422 116.376 179.282 117.034 179.114V175.516H115.48V174.55ZM121.36 169.174H122.326V170.784H125.49V169.174H126.456V170.784H127.576V171.708H126.456V177.91H127.842V178.862H119.932V177.91H121.36V171.708H120.156V170.784H121.36V169.174ZM122.326 177.91H125.49V176.412H122.326V177.91ZM125.49 171.708H122.326V173.164H125.49V171.708ZM122.326 175.502H125.49V174.074H122.326V175.502ZM125.252 179.058C126.372 179.814 127.31 180.556 128.066 181.312L127.352 182.026C126.68 181.298 125.756 180.514 124.58 179.688L125.252 179.058ZM122.522 179.044L123.236 179.674C122.424 180.542 121.416 181.312 120.226 181.956L119.624 181.186C120.772 180.57 121.738 179.856 122.522 179.044Z"
        fill="var(--text-secondary)"
        fillOpacity="0.5"
      />
      <path
        d="M512.5 287.5C512.5 278.663 519.663 271.5 528.5 271.5H617.5C626.337 271.5 633.5 278.663 633.5 287.5C633.5 296.337 626.337 303.5 617.5 303.5H528.5C519.663 303.5 512.5 296.337 512.5 287.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M548.434 282.504H549.764L553.698 292.5H552.452L551.388 289.7H546.796L545.732 292.5H544.5L548.434 282.504ZM547.16 288.734H551.024L549.134 283.736H549.078L547.16 288.734ZM559.021 282.308C560.127 282.308 561.065 282.602 561.821 283.19C562.577 283.778 563.025 284.576 563.165 285.57H562.059C561.919 284.842 561.555 284.282 560.995 283.89C560.449 283.512 559.791 283.33 559.007 283.33C557.845 283.33 556.949 283.736 556.319 284.548C555.731 285.304 555.437 286.298 555.437 287.544C555.437 288.79 555.717 289.784 556.305 290.512C556.921 291.282 557.803 291.674 558.979 291.674C559.777 291.674 560.449 291.464 561.009 291.044C561.597 290.596 562.003 289.938 562.199 289.07H563.305C563.081 290.232 562.563 291.142 561.737 291.786C560.967 292.388 560.043 292.696 558.979 292.696C557.425 292.696 556.235 292.178 555.409 291.156C554.653 290.232 554.289 289.028 554.289 287.544C554.289 286.06 554.667 284.842 555.437 283.89C556.277 282.826 557.481 282.308 559.021 282.308ZM564.895 282.504H571.979V283.498H566.043V286.844H571.643V287.838H566.043V291.506H572.217V292.5H564.895V282.504ZM573.571 281.622H586.031V282.602H580.417C580.305 283.218 580.123 283.82 579.899 284.394H585.275V293.942H584.309V293.242H575.335V293.942H574.369V284.394H578.877C579.101 283.806 579.283 283.218 579.395 282.602H573.571V281.622ZM575.335 292.318H577.267V285.304H575.335V292.318ZM578.205 292.318H581.397V290.526H578.205V292.318ZM582.335 292.318H584.309V285.304H582.335V292.318ZM578.205 289.644H581.397V287.936H578.205V289.644ZM578.205 287.04H581.397V285.304H578.205V287.04ZM587.921 287.796H590.287V286.928H591.267V287.796H593.241V288.706H591.267V289.224C591.953 289.714 592.653 290.26 593.367 290.876L592.835 291.674C592.219 290.988 591.701 290.442 591.267 290.022V293.83H590.287V289.77C589.699 290.834 588.915 291.8 587.935 292.668L587.529 291.604C588.733 290.75 589.629 289.784 590.189 288.706H587.921V287.796ZM599.191 287.11V293.886H598.281V293.41H594.795V293.886H593.885V287.11H599.191ZM594.795 292.598H598.281V291.548H594.795V292.598ZM594.795 290.792H598.281V289.77H594.795V290.792ZM594.795 289.014H598.281V287.95H594.795V289.014ZM588.425 281.44H599.163V282.266H594.291V283.008H599.625V285.654H598.645V283.764H594.291V286.522H593.311V283.764H588.957V285.696H587.977V283.008H593.311V282.266H588.425V281.44ZM589.671 284.492H592.555V285.15H589.671V284.492ZM589.671 285.78H592.555V286.438H589.671V285.78ZM595.033 284.492H597.903V285.15H595.033V284.492ZM595.047 285.78H597.945V286.438H595.047V285.78Z"
        fill="var(--text-secondary)"
        fillOpacity="0.5"
      />
      <path
        d="M50.5 264.5C50.5 255.663 57.6634 248.5 66.5 248.5H184.5C193.337 248.5 200.5 255.663 200.5 264.5C200.5 273.337 193.337 280.5 184.5 280.5H66.5C57.6634 280.5 50.5 273.337 50.5 264.5Z"
        fill="var(--highlight)"
        fillOpacity="0.05"
      />
      <path
        d="M83.508 259.504H90.2V260.498H84.656V263.858H89.906V264.852H84.656V269.5H83.508V259.504ZM92.3721 259.532C92.6101 259.532 92.8061 259.602 92.9741 259.77C93.1421 259.91 93.2261 260.106 93.2261 260.358C93.2261 260.596 93.1421 260.792 92.9741 260.96C92.8061 261.114 92.6101 261.198 92.3721 261.198C92.1341 261.198 91.9381 261.114 91.7701 260.96C91.6021 260.792 91.5321 260.596 91.5321 260.358C91.5321 260.106 91.6021 259.91 91.7701 259.77C91.9381 259.602 92.1341 259.532 92.3721 259.532ZM91.8121 262.262H92.9321V269.5H91.8121V262.262ZM98.2081 262.066C98.6001 262.066 98.9361 262.122 99.2021 262.234V263.354C98.8381 263.242 98.4741 263.2 98.1241 263.2C97.5641 263.2 97.0881 263.438 96.7101 263.942C96.3181 264.418 96.1361 264.992 96.1361 265.664V269.5H95.0301V262.262H96.1361V263.522C96.3321 263.102 96.5841 262.766 96.8921 262.528C97.2701 262.22 97.7041 262.066 98.2081 262.066ZM103.307 262.066C104.413 262.066 105.169 262.514 105.575 263.438C105.855 262.962 106.191 262.612 106.583 262.402C106.933 262.178 107.353 262.066 107.857 262.066C108.613 262.066 109.215 262.304 109.691 262.78C110.139 263.27 110.377 263.928 110.377 264.754V269.5H109.257V264.936C109.257 264.292 109.117 263.816 108.851 263.508C108.571 263.172 108.123 263.018 107.507 263.018C107.031 263.018 106.625 263.186 106.317 263.55C105.981 263.914 105.827 264.376 105.827 264.964V269.5H104.707V264.936C104.707 263.648 104.147 263.018 103.041 263.018C102.523 263.018 102.103 263.214 101.767 263.634C101.431 264.026 101.263 264.516 101.263 265.09V269.5H100.143V262.262H101.263V263.228C101.809 262.444 102.495 262.066 103.307 262.066ZM113.044 259.532C113.282 259.532 113.478 259.602 113.646 259.77C113.814 259.91 113.898 260.106 113.898 260.358C113.898 260.596 113.814 260.792 113.646 260.96C113.478 261.114 113.282 261.198 113.044 261.198C112.806 261.198 112.61 261.114 112.442 260.96C112.274 260.792 112.204 260.596 112.204 260.358C112.204 260.106 112.274 259.91 112.442 259.77C112.61 259.602 112.806 259.532 113.044 259.532ZM112.484 262.262H113.604V269.5H112.484V262.262ZM119.09 262.066C120.882 262.066 121.792 263.06 121.792 265.048V269.5H120.672V265.132C120.672 263.718 120.028 263.018 118.768 263.018C118.264 263.018 117.83 263.2 117.466 263.564C117.074 263.956 116.864 264.474 116.822 265.132V269.5H115.702V262.262H116.822V263.326C117.074 262.92 117.396 262.612 117.788 262.402C118.18 262.178 118.614 262.066 119.09 262.066ZM126.504 262.066C127.596 262.066 128.408 262.542 128.94 263.508V262.262H130.06V268.996C130.06 271.306 128.954 272.468 126.756 272.468C125.776 272.468 125.02 272.272 124.516 271.88C123.998 271.488 123.676 270.9 123.55 270.116H124.67C124.754 270.606 124.964 270.97 125.286 271.194C125.608 271.432 126.098 271.558 126.756 271.558C128.212 271.558 128.94 270.746 128.94 269.15V267.876C128.408 268.842 127.596 269.332 126.504 269.332C125.496 269.332 124.698 268.982 124.11 268.296C123.522 267.624 123.242 266.77 123.242 265.72C123.242 264.656 123.522 263.802 124.11 263.13C124.698 262.416 125.496 262.066 126.504 262.066ZM126.672 262.99C125.944 262.99 125.384 263.242 124.978 263.774C124.586 264.25 124.39 264.908 124.39 265.72C124.39 266.476 124.558 267.106 124.908 267.582C125.3 268.114 125.874 268.394 126.658 268.394C127.386 268.394 127.946 268.142 128.366 267.638C128.758 267.148 128.954 266.504 128.954 265.72C128.954 264.908 128.758 264.25 128.366 263.774C127.946 263.242 127.386 262.99 126.672 262.99ZM136.596 259.504H137.8L143.456 267.638H143.498V259.504H144.646V269.5H143.47L137.786 261.282H137.744V269.5H136.596V259.504ZM149.5 262.066C150.662 262.066 151.544 262.458 152.132 263.242C152.664 263.942 152.944 264.936 152.972 266.196H147.26C147.316 267.008 147.526 267.638 147.918 268.086C148.31 268.534 148.856 268.758 149.542 268.758C150.13 268.758 150.62 268.604 150.984 268.31C151.292 268.058 151.53 267.68 151.712 267.176H152.832C152.664 267.876 152.342 268.436 151.852 268.884C151.25 269.416 150.48 269.696 149.542 269.696C148.506 269.696 147.666 269.346 147.05 268.674C146.406 267.974 146.098 267.05 146.098 265.874C146.098 264.81 146.392 263.914 147.008 263.2C147.624 262.444 148.45 262.066 149.5 262.066ZM149.528 263.004C148.884 263.004 148.366 263.214 147.974 263.634C147.582 264.054 147.358 264.614 147.288 265.328H151.81C151.67 263.774 150.9 263.004 149.528 263.004ZM157.406 262.066C158.302 262.066 159.016 262.276 159.562 262.696C160.122 263.13 160.458 263.788 160.584 264.67H159.478C159.38 264.11 159.156 263.69 158.806 263.41C158.442 263.13 157.98 263.004 157.406 263.004C156.706 263.004 156.146 263.27 155.74 263.802C155.348 264.32 155.152 265.02 155.152 265.902C155.152 266.784 155.334 267.484 155.726 267.988C156.104 268.492 156.664 268.758 157.392 268.758C158.624 268.758 159.338 268.128 159.506 266.882H160.626C160.458 267.806 160.108 268.52 159.548 268.996C159.002 269.458 158.288 269.696 157.392 269.696C156.3 269.696 155.46 269.332 154.858 268.604C154.284 267.918 154.004 267.022 154.004 265.916C154.004 264.81 154.284 263.914 154.858 263.214C155.474 262.444 156.328 262.066 157.406 262.066ZM161.94 259.308H163.06V265.622L166.686 262.262H168.17L164.978 265.174L168.478 269.5H167.036L164.208 265.902L163.06 266.938V269.5H161.94V259.308Z"
        fill="var(--text-secondary)"
        fillOpacity="0.5"
      />
      <path
        d="M396.5 125.5C396.5 115.007 405.007 106.5 415.5 106.5H525.5C535.993 106.5 544.5 115.007 544.5 125.5C544.5 135.993 535.993 144.5 525.5 144.5H415.5C405.007 144.5 396.5 135.993 396.5 125.5Z"
        fill="var(--highlight)"
        fillOpacity="0.1"
      />
      <path
        d="M430.004 119.406H431.957V124.777H438.383V119.406H440.336V133H438.383V126.496H431.957V133H430.004V119.406ZM444.34 133.244C443.949 133.244 443.624 133.14 443.363 132.932C443.109 132.717 442.982 132.411 442.982 132.014C442.982 131.61 443.109 131.301 443.363 131.086C443.624 130.871 443.949 130.764 444.34 130.764C444.737 130.764 445.066 130.871 445.326 131.086C445.587 131.301 445.717 131.61 445.717 132.014C445.717 132.411 445.587 132.717 445.326 132.932C445.066 133.14 444.737 133.244 444.34 133.244ZM452.836 119.406H454.174L459.906 133H457.875L456.498 129.582H450.463L449.096 133H447.104L452.836 119.406ZM455.873 128.02L453.49 122.062L451.098 128.02H455.873ZM462.68 133.244C462.289 133.244 461.964 133.14 461.703 132.932C461.449 132.717 461.322 132.411 461.322 132.014C461.322 131.61 461.449 131.301 461.703 131.086C461.964 130.871 462.289 130.764 462.68 130.764C463.077 130.764 463.406 130.871 463.666 131.086C463.926 131.301 464.057 131.61 464.057 132.014C464.057 132.411 463.926 132.717 463.666 132.932C463.406 133.14 463.077 133.244 462.68 133.244ZM477.836 119.406H479.174L484.906 133H482.875L481.498 129.582H475.463L474.096 133H472.104L477.836 119.406ZM480.873 128.02L478.49 122.062L476.098 128.02H480.873ZM501.38 129.48H511.06V130.74H501.38V129.48ZM501.42 118.08H511.02V119.34H501.42V118.08ZM505.44 116.18H506.9V118.74H505.44V116.18ZM503.94 121.62V123.46H508.46V121.62H503.94ZM502.6 120.5H509.84V124.6H502.6V120.5ZM502.12 125.76H509.2V126.96H502.12V125.76ZM505.44 128.22H506.86V133.12C506.86 133.48 506.813 133.753 506.72 133.94C506.627 134.14 506.44 134.293 506.16 134.4C505.893 134.493 505.533 134.547 505.08 134.56C504.64 134.587 504.08 134.6 503.4 134.6C503.373 134.427 503.32 134.22 503.24 133.98C503.16 133.753 503.073 133.547 502.98 133.36C503.447 133.373 503.887 133.38 504.3 133.38C504.713 133.393 504.98 133.393 505.1 133.38C505.327 133.38 505.44 133.28 505.44 133.08V128.22ZM508.66 125.76H509L509.3 125.68L510.18 126.36C509.687 126.893 509.093 127.413 508.4 127.92C507.72 128.427 507.047 128.847 506.38 129.18C506.3 129.06 506.18 128.927 506.02 128.78C505.873 128.633 505.747 128.513 505.64 128.42C506.2 128.127 506.76 127.753 507.32 127.3C507.893 126.833 508.34 126.4 508.66 126V125.76ZM493.14 120.98H501.06V134.28H499.82V122.26H494.34V134.56H493.14V120.98ZM493.7 128.7H500.38V129.88H493.7V128.7ZM493.7 131.9H500.38V133.12H493.7V131.9ZM492.82 117.1H501.26V118.38H492.82V117.1ZM495.4 117.5H496.48V121.86H495.4V117.5ZM497.62 117.5H498.72V121.86H497.62V117.5ZM495.6 121.84H496.48V123.74C496.48 124.127 496.44 124.553 496.36 125.02C496.28 125.473 496.127 125.92 495.9 126.36C495.687 126.8 495.367 127.207 494.94 127.58C494.873 127.487 494.767 127.38 494.62 127.26C494.473 127.127 494.353 127.033 494.26 126.98C494.647 126.647 494.933 126.3 495.12 125.94C495.32 125.567 495.447 125.193 495.5 124.82C495.567 124.433 495.6 124.067 495.6 123.72V121.84ZM497.62 121.84H498.5V125.32C498.5 125.44 498.513 125.52 498.54 125.56C498.567 125.587 498.64 125.6 498.76 125.6C498.8 125.6 498.867 125.6 498.96 125.6C499.067 125.6 499.173 125.6 499.28 125.6C499.4 125.6 499.487 125.6 499.54 125.6C499.66 125.6 499.733 125.6 499.76 125.6C499.8 125.587 499.827 125.567 499.84 125.54C499.933 125.62 500.053 125.693 500.2 125.76C500.36 125.813 500.507 125.853 500.64 125.88C500.6 126.093 500.5 126.253 500.34 126.36C500.193 126.467 499.973 126.52 499.68 126.52C499.64 126.52 499.547 126.52 499.4 126.52C499.253 126.52 499.107 126.52 498.96 126.52C498.827 126.52 498.733 126.52 498.68 126.52C498.267 126.52 497.987 126.447 497.84 126.3C497.693 126.14 497.62 125.82 497.62 125.34V121.84Z"
        fill="var(--highlight)"
      />
      <path
        d="M544.5 229.5C544.5 219.007 553.007 210.5 563.5 210.5H673.5C683.993 210.5 692.5 219.007 692.5 229.5C692.5 239.993 683.993 248.5 673.5 248.5H563.5C553.007 248.5 544.5 239.993 544.5 229.5Z"
        fill="var(--highlight)"
        fillOpacity="0.1"
      />
      <path
        d="M578.004 223.406H579.957V228.777H586.383V223.406H588.336V237H586.383V230.496H579.957V237H578.004V223.406ZM592.34 237.244C591.949 237.244 591.624 237.14 591.363 236.932C591.109 236.717 590.982 236.411 590.982 236.014C590.982 235.61 591.109 235.301 591.363 235.086C591.624 234.871 591.949 234.764 592.34 234.764C592.737 234.764 593.066 234.871 593.326 235.086C593.587 235.301 593.717 235.61 593.717 236.014C593.717 236.411 593.587 236.717 593.326 236.932C593.066 237.14 592.737 237.244 592.34 237.244ZM600.836 223.406H602.174L607.906 237H605.875L604.498 233.582H598.463L597.096 237H595.104L600.836 223.406ZM603.873 232.02L601.49 226.062L599.098 232.02H603.873ZM610.68 237.244C610.289 237.244 609.964 237.14 609.703 236.932C609.449 236.717 609.322 236.411 609.322 236.014C609.322 235.61 609.449 235.301 609.703 235.086C609.964 234.871 610.289 234.764 610.68 234.764C611.077 234.764 611.406 234.871 611.666 235.086C611.926 235.301 612.057 235.61 612.057 236.014C612.057 236.411 611.926 236.717 611.666 236.932C611.406 237.14 611.077 237.244 610.68 237.244ZM625.836 223.406H627.174L632.906 237H630.875L629.498 233.582H623.463L622.096 237H620.104L625.836 223.406ZM628.873 232.02L626.49 226.062L624.098 232.02H628.873ZM649.38 233.48H659.06V234.74H649.38V233.48ZM649.42 222.08H659.02V223.34H649.42V222.08ZM653.44 220.18H654.9V222.74H653.44V220.18ZM651.94 225.62V227.46H656.46V225.62H651.94ZM650.6 224.5H657.84V228.6H650.6V224.5ZM650.12 229.76H657.2V230.96H650.12V229.76ZM653.44 232.22H654.86V237.12C654.86 237.48 654.813 237.753 654.72 237.94C654.627 238.14 654.44 238.293 654.16 238.4C653.893 238.493 653.533 238.547 653.08 238.56C652.64 238.587 652.08 238.6 651.4 238.6C651.373 238.427 651.32 238.22 651.24 237.98C651.16 237.753 651.073 237.547 650.98 237.36C651.447 237.373 651.887 237.38 652.3 237.38C652.713 237.393 652.98 237.393 653.1 237.38C653.327 237.38 653.44 237.28 653.44 237.08V232.22ZM656.66 229.76H657L657.3 229.68L658.18 230.36C657.687 230.893 657.093 231.413 656.4 231.92C655.72 232.427 655.047 232.847 654.38 233.18C654.3 233.06 654.18 232.927 654.02 232.78C653.873 232.633 653.747 232.513 653.64 232.42C654.2 232.127 654.76 231.753 655.32 231.3C655.893 230.833 656.34 230.4 656.66 230V229.76ZM641.14 224.98H649.06V238.28H647.82V226.26H642.34V238.56H641.14V224.98ZM641.7 232.7H648.38V233.88H641.7V232.7ZM641.7 235.9H648.38V237.12H641.7V235.9ZM640.82 221.1H649.26V222.38H640.82V221.1ZM643.4 221.5H644.48V225.86H643.4V221.5ZM645.62 221.5H646.72V225.86H645.62V221.5ZM643.6 225.84H644.48V227.74C644.48 228.127 644.44 228.553 644.36 229.02C644.28 229.473 644.127 229.92 643.9 230.36C643.687 230.8 643.367 231.207 642.94 231.58C642.873 231.487 642.767 231.38 642.62 231.26C642.473 231.127 642.353 231.033 642.26 230.98C642.647 230.647 642.933 230.3 643.12 229.94C643.32 229.567 643.447 229.193 643.5 228.82C643.567 228.433 643.6 228.067 643.6 227.72V225.84ZM645.62 225.84H646.5V229.32C646.5 229.44 646.513 229.52 646.54 229.56C646.567 229.587 646.64 229.6 646.76 229.6C646.8 229.6 646.867 229.6 646.96 229.6C647.067 229.6 647.173 229.6 647.28 229.6C647.4 229.6 647.487 229.6 647.54 229.6C647.66 229.6 647.733 229.6 647.76 229.6C647.8 229.587 647.827 229.567 647.84 229.54C647.933 229.62 648.053 229.693 648.2 229.76C648.36 229.813 648.507 229.853 648.64 229.88C648.6 230.093 648.5 230.253 648.34 230.36C648.193 230.467 647.973 230.52 647.68 230.52C647.64 230.52 647.547 230.52 647.4 230.52C647.253 230.52 647.107 230.52 646.96 230.52C646.827 230.52 646.733 230.52 646.68 230.52C646.267 230.52 645.987 230.447 645.84 230.3C645.693 230.14 645.62 229.82 645.62 229.34V225.84Z"
        fill="var(--highlight)"
      />
      <path
        d="M25.998 19.832L26.67 19.188C26.922 19.3933 27.1833 19.622 27.454 19.874C27.734 20.1167 27.9953 20.364 28.238 20.616C28.49 20.8587 28.6907 21.0733 28.84 21.26L28.126 22.002C27.9767 21.7967 27.7853 21.568 27.552 21.316C27.3187 21.064 27.0667 20.8073 26.796 20.546C26.5253 20.2847 26.2593 20.0467 25.998 19.832ZM27.076 31.228L26.894 30.248L27.188 29.814L29.68 28.05C29.7173 28.19 29.764 28.3487 29.82 28.526C29.8853 28.7033 29.9413 28.8387 29.988 28.932C29.4 29.3707 28.924 29.7253 28.56 29.996C28.2053 30.2667 27.9253 30.4767 27.72 30.626C27.524 30.7847 27.3793 30.906 27.286 30.99C27.1927 31.0833 27.1227 31.1627 27.076 31.228ZM25.144 23.136H27.748V24.144H25.144V23.136ZM29.652 19.44H36.792V20.42H29.652V19.44ZM30.002 21.82H35.392V22.73H30.002V21.82ZM30.562 24.144H31.5V29.562H30.562V24.144ZM31.136 24.144H34.72V28.624H31.136V27.7H33.768V25.054H31.136V24.144ZM36.414 19.44H37.422V30.262C37.422 30.5887 37.3753 30.8407 37.282 31.018C37.198 31.1953 37.0487 31.3353 36.834 31.438C36.6193 31.522 36.316 31.5733 35.924 31.592C35.5413 31.6107 35.0653 31.62 34.496 31.62C34.4867 31.5267 34.4587 31.4147 34.412 31.284C34.3747 31.1627 34.3327 31.0367 34.286 30.906C34.2393 30.7753 34.1927 30.6587 34.146 30.556C34.4353 30.5747 34.7107 30.584 34.972 30.584C35.2333 30.584 35.462 30.584 35.658 30.584C35.8633 30.584 36.008 30.584 36.092 30.584C36.2133 30.5747 36.2973 30.5467 36.344 30.5C36.3907 30.4627 36.414 30.3833 36.414 30.262V19.44ZM27.076 31.228C27.0387 31.1533 26.9827 31.0693 26.908 30.976C26.8333 30.892 26.754 30.8033 26.67 30.71C26.5953 30.626 26.53 30.5607 26.474 30.514C26.5673 30.4393 26.67 30.3367 26.782 30.206C26.9033 30.066 27.0107 29.9027 27.104 29.716C27.1973 29.52 27.244 29.3053 27.244 29.072V23.136H28.224V29.828C28.224 29.828 28.1867 29.8653 28.112 29.94C28.0373 30.0053 27.9393 30.094 27.818 30.206C27.706 30.3087 27.5893 30.4253 27.468 30.556C27.356 30.6867 27.2627 30.808 27.188 30.92C27.1133 31.0413 27.076 31.144 27.076 31.228ZM40.81 19.804H50.288V20.868H40.81V19.804ZM39.284 24.004H51.744V25.082H39.284V24.004ZM43.722 24.648L44.968 24.97C44.7347 25.5673 44.4733 26.1927 44.184 26.846C43.904 27.4993 43.6147 28.1293 43.316 28.736C43.0267 29.3427 42.742 29.8747 42.462 30.332L41.482 30.01C41.678 29.6553 41.8787 29.2587 42.084 28.82C42.2987 28.372 42.504 27.9053 42.7 27.42C42.9053 26.9347 43.092 26.454 43.26 25.978C43.4373 25.502 43.5913 25.0587 43.722 24.648ZM39.424 29.8C40.096 29.7813 40.8613 29.758 41.72 29.73C42.5787 29.702 43.4933 29.674 44.464 29.646C45.4347 29.618 46.4333 29.5853 47.46 29.548C48.4867 29.5107 49.4993 29.4733 50.498 29.436L50.456 30.43C49.4667 30.4767 48.4727 30.5233 47.474 30.57C46.4753 30.6167 45.4953 30.6587 44.534 30.696C43.582 30.7427 42.6767 30.7847 41.818 30.822C40.9687 30.8593 40.1987 30.8873 39.508 30.906L39.424 29.8ZM47.32 26.874L48.314 26.398C48.762 26.8647 49.2053 27.378 49.644 27.938C50.092 28.498 50.498 29.0487 50.862 29.59C51.226 30.1313 51.5153 30.6213 51.73 31.06L50.68 31.648C50.4747 31.2093 50.19 30.71 49.826 30.15C49.462 29.59 49.0607 29.0253 48.622 28.456C48.1927 27.8773 47.7587 27.35 47.32 26.874ZM53.676 19.356H65.338V31.62H64.288V20.308H54.684V31.62H53.676V19.356ZM54.264 30.094H64.89V31.032H54.264V30.094ZM57.75 26.594L58.198 25.95C58.5713 26.0247 58.9633 26.1227 59.374 26.244C59.7847 26.356 60.1767 26.482 60.55 26.622C60.9327 26.7527 61.2547 26.8787 61.516 27L61.082 27.714C60.8207 27.5833 60.4987 27.448 60.116 27.308C59.7427 27.1587 59.346 27.0233 58.926 26.902C58.5153 26.7807 58.1233 26.678 57.75 26.594ZM58.296 20.588L59.178 20.896C58.9167 21.316 58.604 21.7313 58.24 22.142C57.8853 22.5433 57.5073 22.9167 57.106 23.262C56.714 23.6073 56.322 23.9107 55.93 24.172C55.8833 24.1067 55.8133 24.0367 55.72 23.962C55.6267 23.878 55.5333 23.7987 55.44 23.724C55.3467 23.6493 55.2627 23.5887 55.188 23.542C55.7853 23.1873 56.364 22.7533 56.924 22.24C57.484 21.7173 57.9413 21.1667 58.296 20.588ZM62.034 21.708H62.23L62.384 21.666L62.986 22.016C62.6313 22.5947 62.1693 23.1267 61.6 23.612C61.04 24.088 60.4147 24.5127 59.724 24.886C59.0427 25.2593 58.3333 25.5813 57.596 25.852C56.868 26.1227 56.1493 26.342 55.44 26.51C55.4027 26.426 55.356 26.328 55.3 26.216C55.2533 26.104 55.1973 26.0013 55.132 25.908C55.0667 25.8053 55.0013 25.7213 54.936 25.656C55.6267 25.516 56.3267 25.3293 57.036 25.096C57.7453 24.8627 58.422 24.5827 59.066 24.256C59.7193 23.9293 60.3027 23.5653 60.816 23.164C61.3293 22.7627 61.7353 22.3287 62.034 21.862V21.708ZM57.68 22.478C58.0907 22.9633 58.632 23.4113 59.304 23.822C59.976 24.2327 60.718 24.5873 61.53 24.886C62.3513 25.1753 63.182 25.3993 64.022 25.558C63.9287 25.642 63.8213 25.7633 63.7 25.922C63.588 26.0807 63.4993 26.2253 63.434 26.356C62.5847 26.1693 61.7447 25.908 60.914 25.572C60.0927 25.236 59.332 24.8347 58.632 24.368C57.9413 23.9013 57.3673 23.388 56.91 22.828L57.68 22.478ZM57.974 21.708H62.356V22.52H57.414L57.974 21.708ZM56.35 28.372L56.84 27.658C57.316 27.714 57.8107 27.7887 58.324 27.882C58.8467 27.966 59.3647 28.064 59.878 28.176C60.3913 28.2787 60.872 28.3907 61.32 28.512C61.7773 28.6333 62.174 28.75 62.51 28.862L62.048 29.646C61.6 29.4873 61.054 29.3287 60.41 29.17C59.766 29.002 59.0893 28.848 58.38 28.708C57.6707 28.5587 56.994 28.4467 56.35 28.372Z"
        fill="var(--text-strong)"
      />
    </svg>
  );
}

function IconDemo({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          padding: 12,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-divider)',
          borderRadius: 8,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

function EmptyCell({
  variant,
  size,
}: {
  variant: EmptyStateVariant;
  size: 'compact' | 'standard';
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-divider)',
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontFamily: 'var(--font-data)',
          color: 'var(--text-secondary)',
        }}
      >
        {variant} · {size}
      </span>
      <EmptyState variant={variant} size={size} />
    </div>
  );
}

const iconButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  width: 36,
  height: 36,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  border: '1px solid var(--border-divider)',
  background: 'var(--bg-card)',
  color: 'var(--text-secondary)',
};

const filterChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  height: 24,
  alignItems: 'center',
  borderRadius: 4,
  background: 'color-mix(in srgb, var(--border-divider) 50%, transparent)',
  padding: '0 8px',
  color: 'var(--text-regular)',
  fontSize: 12,
};

const businessCardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-divider)',
  borderRadius: 16,
  padding: 24,
};

const avatarStyle: React.CSSProperties = {
  display: 'inline-flex',
  width: 56,
  height: 56,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 999,
  background: 'var(--highlight)',
  color: 'var(--bg-card)',
  fontSize: 18,
  fontWeight: 700,
};

const topicTagStyle: React.CSSProperties = {
  display: 'inline-flex',
  height: 24,
  alignItems: 'center',
  borderRadius: 4,
  background: 'color-mix(in srgb, var(--text-strong) 6%, transparent)',
  padding: '0 8px',
  color: 'var(--text-secondary)',
  fontSize: 12,
  fontWeight: 400,
};

const sentimentTagStyle: React.CSSProperties = {
  display: 'inline-flex',
  height: 28,
  alignItems: 'center',
  borderRadius: 999,
  background: 'color-mix(in srgb, var(--color-sentiment-negative) 20%, transparent)',
  padding: '0 16px',
  color: 'var(--color-sentiment-negative)',
  fontSize: 12,
  fontWeight: 500,
};

const riskTagStyle: React.CSSProperties = {
  display: 'inline-flex',
  height: 28,
  alignItems: 'center',
  borderRadius: 999,
  background: 'var(--color-risk-high)',
  padding: '0 16px',
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: 500,
};

const emptyNoticeStyle: React.CSSProperties = {
  marginTop: 16,
  borderRadius: 8,
  border: '1px solid color-mix(in srgb, var(--highlight) 50%, transparent)',
  background: 'color-mix(in srgb, var(--highlight) 5%, transparent)',
  padding: '12px 16px',
  color: 'var(--text-secondary)',
  fontSize: 14,
};

const popoverItemStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  height: 32,
  alignItems: 'center',
  borderRadius: 6,
  border: 0,
  background: 'transparent',
  padding: '0 8px',
  color: 'var(--text-regular)',
  fontSize: 14,
};

const codeChip: React.CSSProperties = {
  fontFamily: 'var(--font-data)',
  background: 'var(--bg-secondary)',
  padding: '2px 6px',
  borderRadius: 4,
  fontSize: 12,
  color: 'var(--text-strong)',
};

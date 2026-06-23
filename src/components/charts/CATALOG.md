# 图表组件库目录 (Chart Component Catalog)

> 导入路径: `@/components/charts`
> 设计规范: [DESIGN_SYSTEM.md](../../../DESIGN_SYSTEM.md) 第 6 节「图表规范」
> 主题配色: 11 色序列，来自 `--color-chart-{1..11}` CSS 变量

---

## 组件列表

### ChartLine — 折线图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartLine } from '@/components/charts'` |
| **适用场景** | 趋势分析、数值走势、预测 vs 实际对比、增长率折线 |
| **核心 Props** | `xData: string[]`, `series: { name, data, dashed? }[]` |
| **可选 Props** | `title`, `unit`, `showArea`, `smooth`, `dualSeries`, `height`, `loading`, `optionOverrides` |
| **双系列模式** | `dualSeries={true}` 使用 `#6366F1` + `#1E1B39` 双色 |

```tsx
<ChartLine
  xData={['1月','2月','3月']}
  series={[{ name: '数值', data: [120, 200, 150] }]}
  showArea
/>
```

---

### ChartBar — 柱状图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartBar } from '@/components/charts'` |
| **适用场景** | 平台分布、内容类型占比、分类对比 |
| **核心 Props** | `xData: string[]`, `series: { name, data }[]` |
| **可选 Props** | `title`, `unit`, `horizontal`, `stacked`, `barWidth`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartBar
  xData={['抖音','小红书','微博']}
  series={[{ name: '数量', data: [300, 250, 180] }]}
  horizontal
/>
```

---

### ChartDonut — 环形图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartDonut } from '@/components/charts'` |
| **适用场景** | 情感分布、风险占比、平台占比、分类比例 |
| **核心 Props** | `data: { name, value }[]` |
| **可选 Props** | `title`, `centerText`, `innerRadius`, `outerRadius`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartDonut
  data={[
    { name: '正面', value: 60 },
    { name: '中性', value: 25 },
    { name: '负面', value: 15 },
  ]}
  centerText="60%"
/>
```

---

### ChartRadar — 雷达图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartRadar } from '@/components/charts'` |
| **适用场景** | 多维评估、画像对比、能力对比 |
| **核心 Props** | `indicators: { name, max }[]`, `series: { name, values }[]` |
| **可选 Props** | `title`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartRadar
  indicators={[
    { name: '影响力', max: 100 },
    { name: '活跃度', max: 100 },
    { name: '专业度', max: 100 },
  ]}
  series={[{ name: '系列 A', values: [80, 70, 90] }]}
/>
```

---

### ChartWordCloud — 词云图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartWordCloud } from '@/components/charts'` |
| **适用场景** | 关键词分析、关键词提取、标签词云 |
| **核心 Props** | `words: { name, value }[]` |
| **可选 Props** | `title`, `shape`, `height`, `loading`, `optionOverrides` |
| **颜色规则** | 按词频百分位自动映射：核心词 `#4F46E5`，普通词 `#6E6B8A`，低频词 50% 透明度 |

> **依赖**：`echarts-wordcloud@^2.1.0` 上游 peer 声明 ECharts 5，但运行时与 ECharts 6 兼容。
> 仓库已通过 `.npmrc`（`legacy-peer-deps=true`）放行，`npm install` 可直接安装。

```tsx
<ChartWordCloud
  words={[
    { name: '品牌', value: 100 },
    { name: '口碑', value: 80 },
    { name: '推荐', value: 60 },
  ]}
/>
```

---

### ChartStackedArea — 堆叠面积图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartStackedArea } from '@/components/charts'` |
| **适用场景** | 情绪走势、渠道数值趋势、多分类时间序列 |
| **核心 Props** | `xData: string[]`, `series: { name, data }[]` |
| **可选 Props** | `title`, `unit`, `smooth`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartStackedArea
  xData={['Mon','Tue','Wed','Thu','Fri']}
  series={[
    { name: '正面', data: [120, 132, 101, 134, 90] },
    { name: '中性', data: [220, 182, 191, 234, 290] },
    { name: '负面', data: [30, 42, 31, 34, 19] },
  ]}
/>
```

---

### ChartMiniSparkline — 迷你趋势线

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartMiniSparkline } from '@/components/charts'` |
| **适用场景** | 表格行内趋势、卡片微型图、KPI 卡片趋势线 |
| **核心 Props** | `data: number[]` |
| **可选 Props** | `width` (默认120), `height` (默认32), `color` (默认 `#6366F1`) |
| **特点** | 无轴线、无网格、无 tooltip，纯视觉展示 |

```tsx
<ChartMiniSparkline data={[10, 23, 18, 35, 28, 40, 32]} />
```

---

### ChartBubble — 气泡图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartBubble } from '@/components/charts'` |
| **适用场景** | 多维数据对比、散点分布、投入产出分析 |
| **核心 Props** | `series: { name, data: [x, y, size][] }[]` |
| **可选 Props** | `title`, `unit`, `height`, `loading`, `optionOverrides` |
| **颜色规则** | 图例 100% 不透明度，气泡填充 40% 不透明度 |

```tsx
<ChartBubble
  series={[
    { name: '抖音', data: [[10, 20, 500], [15, 30, 800], [20, 10, 300]] },
    { name: '小红书', data: [[12, 25, 600], [18, 15, 400]] },
  ]}
/>
```

---

### ChartFunnel — 漏斗图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartFunnel } from '@/components/charts'` |
| **适用场景** | 转化漏斗、用户流程转化、销售漏斗 |
| **核心 Props** | `data: { name, value }[]` |
| **可选 Props** | `title`, `showLabel`, `height`, `loading`, `optionOverrides` |
| **透明度** | 顶层 100% → 底层 0%，线性递减 |

```tsx
<ChartFunnel
  data={[
    { name: '访问', value: 10000 },
    { name: '注册', value: 6000 },
    { name: '付费', value: 2000 },
    { name: '复购', value: 800 },
  ]}
/>
```

---

### ChartSankey — 桑基图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartSankey } from '@/components/charts'` |
| **适用场景** | 流量来源、内容流转、用户路径分析 |
| **核心 Props** | `nodes: { name }[]`, `links: { source, target, value }[]` |
| **可选 Props** | `title`, `height`, `loading`, `optionOverrides` |
| **连线规则** | 颜色跟随源节点，20% 不透明度 |

```tsx
<ChartSankey
  nodes={[{ name: '搜索' }, { name: '推荐' }, { name: '详情页' }, { name: '购买' }]}
  links={[
    { source: '搜索', target: '详情页', value: 500 },
    { source: '推荐', target: '详情页', value: 300 },
    { source: '详情页', target: '购买', value: 200 },
  ]}
/>
```

---

### ChartProportion — 占比图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartProportion } from '@/components/charts'` |
| **适用场景** | 大面积百分比展示、分类占比、预算分配 |
| **核心 Props** | `data: { name, value }[]` |
| **可选 Props** | `title`, `showPercentLabel`, `height`, `loading`, `optionOverrides` |
| **标签规则** | 最大扇区 48px，次大 28px，其余 20px，DIN Alternate 字体 |
| **对比 ChartDonut** | Donut 侧重小型占比 + 中心文字；Proportion 侧重大面积百分比展示 |

```tsx
<ChartProportion
  data={[
    { name: '品牌A', value: 45 },
    { name: '品牌B', value: 30 },
    { name: '品牌C', value: 25 },
  ]}
/>
```

---

### ChartFlow — 流程图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartFlow } from '@/components/charts'` |
| **适用场景** | 步骤流程、审批流程、任务流 |
| **核心 Props** | `steps: { label, description? }[]` |
| **可选 Props** | `height`, `className` |
| **实现** | 纯 React + CSS，非 ECharts（不依赖 canvas） |
| **特点** | 起点/终点节点主色背景，超宽自动水平滚动 |

```tsx
<ChartFlow
  steps={[
    { label: '数据引用', description: '多平台数据' },
    { label: '数据清洗' },
    { label: '分析建模' },
    { label: '报告输出' },
  ]}
/>
```

---

## 底层组件

### EChartsBase — SSR-Safe 基座

| 属性 | 说明 |
|------|------|
| **导入** | `import { EChartsBase } from '@/components/charts'` |
| **用途** | 当上述预设组件不满足需求时，直接使用 EChartsBase 构建自定义图表 |
| **Props** | `option`, `height`, `width`, `loading`, `className`, `style`, `notMerge`, `lazyUpdate`, `onEvents`, `setOptionOpts` |
| **SSR** | 内部 dynamic import echarts，自动跳过 SSR |

---

## 工具函数

| 函数/常量 | 导入路径 | 用途 |
|-----------|---------|------|
| `CHART_COLORS` | `@/components/charts` | 11 色数组常量 |
| `DUAL_SERIES_COLORS` | `@/components/charts` | `['#6366F1', '#1E1B39']` 双系列专用 |
| `getChartColor(index)` | `@/components/charts` | 按索引安全取色（自动循环） |
| `makeTooltipFormatter(unit?)` | `@/components/charts` | 生成标准 tooltip 格式化函数（数字用 DIN Alternate 字体） |

---

## 扩展指南

添加新图表组件时：

1. 在 `src/components/charts/` 创建 `Chart[Name].tsx`
2. 标记 `'use client'`
3. 导入 `EChartsBase` + `chartTheme`
4. 定义面向业务数据的 Props 接口（不暴露 ECharts option）
5. 内部构建 option 传给 `EChartsBase`
6. 支持 `optionOverrides` escape hatch
7. 在 `index.ts` 中导出
8. 更新本文件 CATALOG.md

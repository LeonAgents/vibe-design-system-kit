import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { TenantProvider, UserProvider } from '@/contexts';
import './globals.css';

/**
 * 字体策略：使用系统字体栈（在 globals.css 的 `--font-sans` 中定义为 Inter + Roboto + PingFang SC...）
 *
 * 不在 layout 里用 `next/font/google`，原因：
 *   1. 公司内网可能无法访问 Google Fonts（构建会失败）
 *   2. 系统字体栈足以覆盖中英文混排，性能更好
 *
 * 真正需要 Google Fonts（或其他自托管字体）时：
 *   1. 把字体文件放到 public/fonts/
 *   2. 在 globals.css 用 @font-face 加载
 *   3. 或使用 next/font/local 引用本地字体文件
 */

export const metadata: Metadata = {
  title: 'Vibe Design System Kit',
  description: 'Vibe 设计系统预览 — 可移植的设计 token、组件与主题',
};

/**
 * Provider 嵌套顺序（自外向内，见 DESIGN_SYSTEM.md Part 3）：
 *   TenantProvider → UserProvider → children
 *   Toaster 平铺在 body 末尾，sonner 自管挂载位置
 *
 * 未来扩展（暂不接入）：
 *   - ThemeProvider (next-themes)：DESIGN_SYSTEM.md 尚无暗色变量
 *   - 数据缓存层：目标项目可按需接入，本规范包预览页不内置业务数据层
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <TenantProvider>
          <UserProvider>{children}</UserProvider>
          <Toaster position="top-right" richColors />
        </TenantProvider>
      </body>
    </html>
  );
}

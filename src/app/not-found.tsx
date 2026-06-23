import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="mb-6 flex size-16 items-center justify-center rounded-full"
        style={{ background: 'var(--highlight-light)', color: 'var(--highlight)' }}
      >
        <FileQuestion className="size-7" strokeWidth={1.75} />
      </div>
      <h1
        className="text-[var(--text-strong)]"
        style={{ fontSize: 32, fontWeight: 700 }}
      >
        404
      </h1>
      <p
        className="mt-2 text-[var(--text-secondary)]"
        style={{ fontSize: 14 }}
      >
        你访问的页面不存在或已被移除。
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center rounded-md px-4 py-2 text-sm text-[var(--highlight-foreground)] transition-opacity hover:opacity-90"
        style={{ background: 'var(--highlight)', fontWeight: 500 }}
      >
        返回仪表盘
      </Link>
    </main>
  );
}

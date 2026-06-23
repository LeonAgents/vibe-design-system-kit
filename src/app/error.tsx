'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Next.js App Router 全局错误兜底页。
 *
 * 触发条件：Provider 层 / 路由级别抛出未捕获错误。
 * 单页错误由 `src/components/shell/ErrorBoundary.tsx` 在 MainArea 内拦截。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[GlobalError]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--highlight-light)] text-[var(--highlight)]"
      >
        <AlertTriangle className="size-7" strokeWidth={1.75} />
      </div>
      <h1 className="text-[24px] font-bold text-[var(--text-strong)]">
        出错了
      </h1>
      <p className="mt-2 max-w-[480px] text-center text-[14px] text-[var(--text-secondary)]">
        系统遇到了未预期的问题。请尝试刷新；如果反复出现，请联系管理员。
      </p>
      {process.env.NODE_ENV !== 'production' && (
        <pre className="mt-4 max-w-[640px] overflow-auto rounded-lg bg-[var(--bg-secondary)] p-3 text-[12px] text-[var(--text-regular)]">
          {error.message}
          {error.digest && `\nDigest: ${error.digest}`}
        </pre>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md border-0 bg-[var(--highlight)] px-5 py-2 text-[14px] font-medium text-[var(--bg-card)]"
      >
        <RotateCcw className="size-3.5" />
        重试
      </button>
    </div>
  );
}

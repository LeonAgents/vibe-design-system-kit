'use client';

import { useMemo } from 'react';
import s from './DataPagination.module.css';

interface DataPaginationProps {
    total: number;
    pageSize: number;
    currentPage: number;
    onChange: (page: number) => void;
}

export default function DataPagination({ total, pageSize, currentPage, onChange }: DataPaginationProps) {
    const totalPages = Math.ceil(total / pageSize);

    const pages = useMemo(() => {
        const result: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) result.push(i);
        } else {
            result.push(1);
            if (currentPage > 3) result.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) result.push(i);
            if (currentPage < totalPages - 2) result.push('...');
            result.push(totalPages);
        }
        return result;
    }, [totalPages, currentPage]);

    if (totalPages <= 1) return null;

    return (
        <div className={s.pagination}>
            <span className={s.total}>共 {total} 条</span>
            <div className={s.pages}>
                <button
                    onClick={() => currentPage > 1 && onChange(currentPage - 1)}
                    className={currentPage <= 1 ? s.textBtnDisabled : s.textBtn}
                    disabled={currentPage <= 1}
                >
                    上一页
                </button>
                {pages.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className={s.ellipsis}>…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={p === currentPage ? s.btnActive : s.btn}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => currentPage < totalPages && onChange(currentPage + 1)}
                    className={currentPage >= totalPages ? s.textBtnDisabled : s.textBtn}
                    disabled={currentPage >= totalPages}
                >
                    下一页
                </button>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";

interface PaginationProps {
  basePath?: string;
  currentPage: number;
  totalPages: number;
  total?: number;
  perPage?: number;
  searchParams?: Record<string, string | undefined>;
  /** 若提供则使用按钮切换页码（客户端分页，如搜索页） */
  onPageChange?: (page: number) => void;
}

export function Pagination({
  basePath = "",
  currentPage,
  totalPages,
  total,
  perPage,
  searchParams = {},
  onPageChange,
}: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const q = params.toString();
    return q ? `${basePath}?${q}` : basePath;
  };

  if (totalPages <= 1) return null;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;

  const pages: number[] = [];
  for (let p = Math.max(1, currentPage - 2); p <= Math.min(totalPages, currentPage + 2); p++) {
    pages.push(p);
  }

  const linkOrButton = (page: number, label: React.ReactNode, className: string) => {
    if (onPageChange) {
      return (
        <button
          type="button"
          onClick={() => onPageChange(page)}
          className={className}
        >
          {label}
        </button>
      );
    }
    return (
      <Link href={buildUrl(page)} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"
      aria-label="分页"
    >
      <div className="text-xs text-accent-silver">
        {total != null && perPage != null && (
          <>
            第 {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)} 条，共 {total} 条
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showPrev &&
          linkOrButton(
            prevPage,
            "上一页",
            "rounded-lg border border-white/20 px-3 py-1.5 text-sm text-accent-silver transition hover:border-accent-gold/60 hover:text-accent-gold"
          )}
        <div className="flex items-center gap-1">
          {pages.map((p) =>
            p === currentPage ? (
              <span
                key={p}
                className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-accent-gold/70 bg-accent-gold/20 px-2 text-sm font-medium text-accent-gold"
              >
                {p}
              </span>
            ) : onPageChange ? (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-white/20 px-2 text-sm text-accent-silver transition hover:border-accent-gold/60 hover:text-accent-gold"
              >
                {p}
              </button>
            ) : (
              <Link
                key={p}
                href={buildUrl(p)}
                className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg border border-white/20 px-2 text-sm text-accent-silver transition hover:border-accent-gold/60 hover:text-accent-gold"
              >
                {p}
              </Link>
            )
          )}
        </div>
        {showNext &&
          linkOrButton(
            nextPage,
            "下一页",
            "rounded-lg border border-white/20 px-3 py-1.5 text-sm text-accent-silver transition hover:border-accent-gold/60 hover:text-accent-gold"
          )}
      </div>
    </nav>
  );
}

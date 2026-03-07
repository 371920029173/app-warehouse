"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { APPS_PER_PAGE, CATEGORIES, searchAppsPaginated } from "@/lib/apps";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = APPS_PER_PAGE;

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const { results, total, totalPages } = useMemo(
    () => searchAppsPaginated(keyword.trim(), page, PER_PAGE),
    [keyword, page]
  );
  const onKeywordChange = (v: string) => {
    setKeyword(v);
    setPage(1);
  };

  return (
    <div className="layout-shell grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2.5fr)]">
      <aside className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-silver">
          分类
        </h2>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/apps/${cat.id}`}
              className="flex items-center rounded-xl border border-transparent px-3 py-2 text-sm text-neutral-light/80 transition-all hover:border-accent-gold/60 hover:bg-neutral-dark/60 hover:text-accent-gold"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        <h1 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-silver">
          搜索 / 高级筛选
        </h1>
        <input
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="输入应用名称、描述或标签…"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-500/60"
        />
        {keyword.trim() && (
          <p className="text-xs text-accent-silver">
            共找到 {total} 个应用
          </p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((app) => (
            <Link
              key={app.slug}
              href={`/apps/detail/${app.slug}`}
              className="card-elevated flex flex-col justify-between p-4 transition-transform hover:-translate-y-1"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-light hover:text-accent-gold">
                  {app.name}
                </h3>
                <p className="line-clamp-2 text-xs text-accent-silver">
                  {app.description}
                </p>
              </div>
              <span className="mt-2 text-[11px] text-accent-silver">
                {app.versions[0]?.version}
              </span>
            </Link>
          ))}
        </div>
        {keyword.trim() && total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        )}
        {keyword.trim() && total === 0 && (
          <p className="py-8 text-center text-sm text-accent-silver">
            未找到匹配的应用，请换个关键词试试。
          </p>
        )}
      </section>
    </div>
  );
}

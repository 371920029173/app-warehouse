"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { AppCategory } from "@/lib/apps";

type Cat = { id: AppCategory; name: string; icon: string };

export function CategorySidebar({
  categories,
  currentCategoryId,
}: {
  categories: Cat[];
  currentCategoryId?: AppCategory;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="space-y-3 md:space-y-4">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-accent-silver transition-all duration-200 ease-out hover:border-accent-gold/40 hover:bg-neutral-dark/50 hover:text-accent-gold"
      >
        <span>分类浏览</span>
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
        )}
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1.5 pt-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/apps/${cat.id}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ease-out ${
                  cat.id === currentCategoryId
                    ? "border border-accent-gold/70 bg-neutral-dark/80 text-accent-gold shadow-sm"
                    : "border border-transparent text-neutral-light/80 hover:-translate-y-0.5 hover:border-accent-gold/60 hover:bg-neutral-dark/60 hover:text-accent-gold"
                }`}
              >
                <CategoryIcon icon={cat.icon} className="h-5 w-5 shrink-0 text-accent-silver/80" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

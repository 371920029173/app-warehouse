import Link from "next/link";
import { APPS_PER_PAGE, CATEGORIES, getAppsByCategoryPaginated } from "@/lib/apps";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Pagination } from "@/components/Pagination";

export const runtime = "edge";

interface Props {
  searchParams: { page?: string };
}

export default function AppsPage({ searchParams }: Props) {
  const defaultCategory = CATEGORIES[0];
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);
  const { apps, total, totalPages } = getAppsByCategoryPaginated(
    defaultCategory.id,
    page,
    APPS_PER_PAGE
  );

  return (
    <div className="layout-shell grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2.5fr)_minmax(0,1.3fr)]">
      <aside className="space-y-3 md:space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-silver">
          分类浏览
        </h2>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/apps/${cat.id}`}
              className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-neutral-light/80 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-accent-gold/60 hover:bg-neutral-dark/60 hover:text-accent-gold"
            >
              <CategoryIcon icon={cat.icon} className="h-5 w-5 shrink-0 text-accent-silver/80" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-silver">
              应用仓库 · {defaultCategory.name}
            </h1>
            <p className="mt-1 text-xs text-accent-silver/90">
              共 {total} 个应用，每页 {APPS_PER_PAGE} 个，点击分类可切换。
            </p>
          </div>
          <Link
            href="/apps/search"
            className="text-xs text-accent-gold hover:text-amber-300"
          >
            搜索 / 高级筛选 →
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {apps.map((app) => (
            <Link
              key={app.slug}
              href={`/apps/detail/${app.slug}`}
              className="group card-elevated flex flex-col justify-between p-4 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-neutral-light group-hover:text-accent-gold">
                    {app.name}
                  </h3>
                  <span className="rounded-full border border-accent-silver/40 px-2 py-0.5 text-[10px] text-accent-silver">
                    {app.platforms.join(" / ")}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-accent-silver">
                  {app.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-accent-silver/90">
                <span>
                  最新版本：{app.versions[0]?.version} · 更新于{" "}
                  {app.versions[0]?.updatedAt}
                </span>
                <span className="inline-flex items-center gap-1 text-accent-gold group-hover:translate-x-0.5 transition-transform">
                  查看版本
                  <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Pagination
          basePath="/apps"
          currentPage={page}
          totalPages={totalPages}
          total={total}
          perPage={APPS_PER_PAGE}
          searchParams={searchParams}
        />
      </section>

      <aside className="space-y-3 md:space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-silver">
          广告与推荐
        </h2>
        <div className="card-elevated rounded-xl border border-white/10 p-3 text-[11px] text-accent-silver">
          <p>广告栏已移至页面顶部，支持折叠。有效浏览 3 秒可获得 1 触点。</p>
        </div>
        <div className="card-elevated flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-accent-silver/30 bg-neutral-dark/50 text-xs text-accent-silver/60">
          （暂无内容）
        </div>
      </aside>
    </div>
  );
}


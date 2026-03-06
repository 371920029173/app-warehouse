import Link from "next/link";

export default function HomePage() {
  return (
    <div className="layout-shell">
      <section className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-pill border border-accent-silver/40 bg-neutral-dark/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-accent-silver/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
            通用应用仓库 · Cloudflare 免费隧道 · AdSense 变现
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            一站式 <span className="text-accent-gold">应用仓库</span>{" "}
            与{" "}
            <span className="text-accent-gold">Cloudflare 隧道触点体系</span>
          </h1>
          <p className="max-w-xl text-sm text-accent-silver md:text-base">
            AppWarehouse 聚合 8 大通用类别的高质量应用，提供版本导航与官网跳转，
            同时结合触点货币体系与 Cloudflare 隧道，为中国用户提供高效、可控的访问体验。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/apps" className="btn-primary">
              浏览应用仓库
            </Link>
            <Link href="/tunnel" className="btn-secondary">
              启动 Cloudflare 隧道
            </Link>
          </div>
        </div>

        <div className="card-elevated relative overflow-hidden p-6 md:p-7">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-gold/5 via-transparent to-brand-primary/25 opacity-80" />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-accent-silver">
              首页顶部广告位预览（728x90）
            </p>
            <div className="flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-accent-silver/40 bg-neutral-dark/60 text-xs text-accent-silver">
              AdSense 首页横幅广告（待接入）
            </div>
            <p className="text-xs text-accent-silver">
              此广告位用于与工具类、SaaS 或高价值应用做自然融合投放，待 AdSense 审核通过后，
              仅需填入官方广告代码即可激活，无需修改布局。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppBySlug } from "@/lib/apps";
import { FavoriteButton } from "@/components/FavoriteButton";

export const runtime = "edge";

interface Props {
  params: { slug: string };
}

export default function AppDetailPage({ params }: Props) {
  const app = getAppBySlug(params.slug);
  if (!app) {
    notFound();
  }

  return (
    <div className="layout-shell grid gap-6 md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.6fr)]">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-neutral-light">
              {app.name}
            </h1>
            <p className="text-xs text-accent-silver">
              分类：{app.category} · 适配：{app.platforms.join(" / ")}
            </p>
          </div>
          <Link
            href="/apps"
            className="text-xs text-accent-gold hover:text-amber-300"
          >
            ← 返回应用仓库
          </Link>
        </div>

        <div className="card-elevated space-y-3 p-4">
          <p className="text-sm text-neutral-light">{app.description}</p>
          <p className="text-xs text-accent-silver">
            提示：本站仅做导航与跳转，所有下载链接均指向官方站点或合规镜像，不提供任何软件安装包托管。
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-silver">
            版本列表
          </h2>
          <div className="space-y-3">
            {app.versions.map((v) => (
              <div
                key={v.version}
                className="card-elevated flex flex-col gap-3 p-4 text-xs text-accent-silver"
              >
              <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-light">
                      {v.version}
                    </p>
                    <p className="mt-0.5 text-[11px]">
                      更新于 {v.updatedAt} · 适配 {v.platforms.join(" / ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={v.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary px-3 py-1.5 text-xs"
                    >
                      前往官网 / 下载
                    </a>
                    {v.cnMirrorUrls && v.cnMirrorUrls.length > 0 && (
                      <a
                        href={v.cnMirrorUrls[0]}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        国内加速访问
                      </a>
                    )}
                    <FavoriteButton
                      appName={app.name}
                      appVersion={v.version}
                    />
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-accent-silver/90">
                  更新摘要：{v.changelog}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="card-elevated h-40 rounded-xl border border-dashed border-accent-silver/40 bg-neutral-dark/70 p-4 text-xs text-accent-silver">
          <p className="font-semibold text-neutral-light">
            版本页内嵌广告位（300x250）
          </p>
          <p className="mt-2">
            建议用于展示工具类 / 云服务广告，与该应用使用场景强相关，以提升点击率与 AdSense
            收益。
          </p>
        </div>

        <div className="card-elevated space-y-2 p-4 text-[11px] text-accent-silver">
          <p className="font-semibold text-neutral-light">收藏与触点提示</p>
          <p>
            登录后可收藏该应用及指定版本，收藏记录会同步到 Cloudflare D1。
            赞助链接访问可获得触点，用于后续 Cloudflare 隧道使用。
          </p>
        </div>
      </aside>
    </div>
  );
}


import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function AccountPage() {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; name?: string } | null;

  if (!user?.id) {
    return (
      <div className="layout-shell max-w-2xl">
        <div className="card-elevated space-y-3 p-6 text-sm text-accent-silver">
          <p className="text-neutral-light">
            需要登录后才能访问个人中心与触点、隧道记录。
          </p>
          <a href="/login" className="btn-primary inline-flex justify-center">
            去登录 / 注册
          </a>
        </div>
      </div>
    );
  }

  const db = getDB();

  const balanceRow = await db
    .prepare(
      "SELECT COALESCE(SUM(amount), 0) as balance FROM points WHERE user_id = ?"
    )
    .bind(user.id)
    .first<{ balance: number }>();

  const balance = balanceRow?.balance ?? 0;

  const tunnelRows = await db
    .prepare(
      "SELECT id, start_time, end_time, points_consumed, auto_renew FROM tunnel_usage WHERE user_id = ? ORDER BY start_time DESC LIMIT 20"
    )
    .bind(user.id)
    .all<{
      id: string;
      start_time: string;
      end_time: string | null;
      points_consumed: number;
      auto_renew: number;
    }>();

  const favRows = await db
    .prepare(
      "SELECT app_name, app_version, created_at FROM app_collections WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
    )
    .bind(user.id)
    .all<{
      app_name: string;
      app_version: string;
      created_at: string;
    }>();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    "https://your-appwarehouse-domain.example";
  const inviteLink = `${baseUrl}/?ref=${encodeURIComponent(user.id)}`;

  return (
    <div className="layout-shell space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card-elevated space-y-2 p-4 text-sm text-accent-silver md:col-span-2">
          <p className="text-xs uppercase tracking-[0.16em] text-accent-silver">
            用户信息
          </p>
          <p className="text-neutral-light">
            {user.name || "未设置昵称"} · {user.email}
          </p>
          <p className="text-xs text-accent-silver/90">
            你的触点余额、隧道记录与收藏都会与该账户绑定，并存储于 Cloudflare D1。
          </p>
        </div>
        <div className="card-elevated space-y-2 p-4 text-sm text-accent-silver">
          <p className="text-xs uppercase tracking-[0.16em] text-accent-silver">
            触点余额
          </p>
          <p className="text-2xl font-semibold text-accent-gold">{balance}</p>
          <p className="text-[11px]">
            · 点击站内广告获得触点
            <br />· 邀请好友注册获得更多触点
            <br />· 使用 Cloudflare 隧道每 15 分钟消耗 1 触点
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-elevated space-y-3 p-4 text-sm text-accent-silver">
          <p className="text-xs uppercase tracking-[0.16em] text-accent-silver">
            邀请链接
          </p>
          <p className="break-all text-xs text-accent-gold">{inviteLink}</p>
          <p className="text-[11px]">
            通过该链接注册的新用户，会为你带来 5 个触点奖励，同时可逐步解锁“无广告”权益。
          </p>
        </div>
        <div className="card-elevated space-y-3 p-4 text-sm text-accent-silver">
          <p className="text-xs uppercase tracking-[0.16em] text-accent-silver">
            最近隧道使用
          </p>
          <div className="space-y-2 text-[11px]">
            {tunnelRows.results.length === 0 && (
              <p className="text-accent-silver/80">暂未使用过 Cloudflare 隧道。</p>
            )}
            {tunnelRows.results.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-accent-silver/20 bg-neutral-dark/60 px-2 py-1.5"
              >
                <span>
                  {new Date(row.start_time).toLocaleString("zh-CN", {
                    hour12: false
                  })}
                </span>
                <span>
                  消耗 {row.points_consumed} 触点 ·{" "}
                  {row.end_time ? "已结束" : "进行中"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card-elevated space-y-3 p-4 text-sm text-accent-silver">
        <p className="text-xs uppercase tracking-[0.16em] text-accent-silver">
          收藏应用
        </p>
        <div className="space-y-2 text-[11px]">
          {favRows.results.length === 0 && (
            <p className="text-accent-silver/80">
              暂无收藏，去应用仓库看看感兴趣的应用吧。
            </p>
          )}
          {favRows.results.map((row, idx) => (
            <div
              key={`${row.app_name}-${idx}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-accent-silver/20 bg-neutral-dark/60 px-2 py-1.5"
            >
              <span>
                {row.app_name} · {row.app_version}
              </span>
              <span>{new Date(row.created_at).toLocaleDateString("zh-CN")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


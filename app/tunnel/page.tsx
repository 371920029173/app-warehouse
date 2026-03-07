"use client";

import { useState } from "react";
import { ArrowTopRightOnSquareIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { AdPopup } from "@/components/AdPopup";

export default function TunnelPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [tunnelUrl, setTunnelUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showFrame, setShowFrame] = useState(false);

  async function handleStartTunnel() {
    setStatus(null);
    setTunnelUrl(null);
    setCountdown(null);
    setShowAdPopup(false);

    try {
      const res = await fetch("/api/tunnel/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetUrl }),
      });

      if (res.status === 402) {
        setStatus("触点不足。请通过赞助链接或邀请好友获得触点后再试。");
        setShowAdPopup(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "启动隧道失败");
      }

      const data = await res.json();
      setTunnelUrl(data.tunnelUrl);
      setCountdown(15 * 60);
      setStatus("隧道已启动，15 分钟内有效。");

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return prev;
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      setStatus(e.message || "发生未知错误");
    }
  }

  const minutes = countdown !== null ? Math.floor(countdown / 60) : null;
  const seconds = countdown !== null ? countdown % 60 : null;

  return (
    <div className="layout-shell max-w-3xl">
      <div className="space-y-4">
        <h1 className="text-lg font-semibold text-neutral-light">
          Cloudflare 隧道 · 小范围代理访问
        </h1>
        <p className="text-xs text-accent-silver">
          输入目标网址，消耗 1 触点获得 15 分钟内有效的隧道链接。<strong>经代理打开</strong>时由我们服务器代你请求目标再传回，可在你当前网络无法直连该站时使用。
        </p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200/90">
          <strong>提示：</strong>部分大站（如 Google）会对代理做人机校验或拦截，可优先尝试小站、文档站、GitHub、Stack Overflow 等。若你网络已能直连目标，可用「一键跳转」省流量。
        </div>

        <div className="card-elevated space-y-3 p-4">
          <label className="space-y-1 text-xs text-accent-silver">
            <span>目标网址（仅支持 http/https）</span>
            <input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://你要访问的网站.com"
              className="w-full rounded-xl border border-accent-silver/40 bg-neutral-dark/70 px-3 py-2 text-sm text-neutral-light outline-none transition-colors focus:border-accent-gold"
            />
          </label>
          <button
            onClick={handleStartTunnel}
            className="btn-primary w-full justify-center"
          >
            启动隧道（消耗 1 触点）
          </button>

          {status && (
            <p className="text-xs text-accent-silver">
              当前状态：<span className="text-accent-gold">{status}</span>
            </p>
          )}

          {countdown !== null && (
            <p className="text-xs text-accent-silver">
              剩余时间：{minutes} 分 {seconds?.toString().padStart(2, "0")} 秒
            </p>
          )}

          {tunnelUrl && (
            <div className="space-y-3 text-xs text-accent-silver">
              <p>你的专属隧道链接（仅当前登录用户可见，15 分钟内有效）：</p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={tunnelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/30 px-4 py-3 text-emerald-300 transition-colors hover:bg-emerald-600/50 font-medium"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  经代理在新标签打开（翻墙用）
                </a>
                <button
                  type="button"
                  onClick={() => setShowFrame((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-3 text-accent-silver transition-colors hover:border-accent-gold/50 hover:text-accent-gold"
                >
                  <ComputerDesktopIcon className="h-5 w-5" />
                  {showFrame ? "关闭小窗" : "在页面内小窗打开（翻墙用）"}
                </button>
              </div>
              {showFrame && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                  <iframe
                    title="隧道小窗"
                    src={tunnelUrl}
                    className="h-[420px] w-full border-0 bg-white"
                  />
                </div>
              )}
              <p className="text-[11px] text-neutral-500">
                若目标站出现人机校验或无法打开，可换小站/文档站尝试，或用下方一键直连（仅在你网络能访问该目标时有效）。
              </p>
              <a
                href={`${tunnelUrl}${tunnelUrl.includes("?") ? "&" : "?"}direct=1`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-neutral-400 hover:text-accent-gold"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                一键跳转（本页直连目标，不经过代理）
              </a>
            </div>
          )}
        </div>

        <div className="card-elevated space-y-2 p-4 text-[11px] text-accent-silver">
          <p className="font-semibold text-neutral-light">使用与合规说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>仅对登录用户开放，需 ≥1 个有效触点。经代理打开时由我们服务器请求目标再传回，供小范围代理访问使用。</li>
            <li>严禁用于攻击、扫描、传播违法内容等用途，如有违规可随时封禁账号。</li>
          </ul>
        </div>
      </div>

      <AdPopup
        open={showAdPopup}
        onClose={() => setShowAdPopup(false)}
        title="触点不足 · 通过赞助链接获得触点"
      />
    </div>
  );
}


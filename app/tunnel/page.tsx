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
          Cloudflare 隧道 · 触点驱动访问
        </h1>
        <p className="text-xs text-accent-silver">
          输入你希望访问的网站地址（例如{" "}
          <span className="font-mono text-accent-gold">
            https://example.com
          </span>
          ），系统会基于 Cloudflare 边缘网络为你创建一个 15
          分钟有效的“软隧道”，消耗 1 个触点。
        </p>

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
              <p>你的专属隧道链接（仅当前登录用户可见）：</p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={tunnelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-2 text-accent-gold transition-colors hover:bg-amber-500/30 hover:text-amber-300"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  在新窗口直接打开
                </a>
                <button
                  type="button"
                  onClick={() => setShowFrame((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-accent-silver transition-colors hover:border-accent-gold/50 hover:text-accent-gold"
                >
                  <ComputerDesktopIcon className="h-4 w-4" />
                  {showFrame ? "关闭" : "在页面内小窗打开"}
                </button>
              </div>
              <p className="break-all font-mono text-[11px] text-neutral-500">{tunnelUrl}</p>
              <p className="text-[11px] text-neutral-500">
                若目标站出现安全验证/人机校验页，属该站策略，可换其他站点或网络再试。
              </p>
              {showFrame && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                  <p className="border-b border-white/10 px-3 py-1.5 text-[11px] text-neutral-500">
                    部分网站禁止被嵌入，若无法显示可点击「在新窗口直接打开」
                  </p>
                  <iframe
                    title="隧道小窗"
                    src={tunnelUrl}
                    className="h-[420px] w-full border-0 bg-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card-elevated space-y-2 p-4 text-[11px] text-accent-silver">
          <p className="font-semibold text-neutral-light">使用与合规说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>仅对登录用户开放，且需要拥有 ≥1 个有效触点。</li>
            <li>严禁用于攻击、扫描、传播违法内容等用途，如有违规可随时封禁账号。</li>
            <li>
              “隧道”本质为基于 Cloudflare Pages Functions 的受控代理，不提供本地网络穿透能力。
            </li>
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


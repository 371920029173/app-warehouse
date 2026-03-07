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
          输入目标网址，消耗 1 触点获得 15 分钟内有效的访问链接。点击后由<strong>你本地浏览器直连目标</strong>，只要当前网络能访问该目标即可打开。
        </p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200/90">
          <strong>已知限制：</strong>本功能不提供翻墙/解封。若目标站在你当前网络下不可达（如地区或运营商封锁），无法通过本产品绕过，需自行使用 VPN 等后再访问本站使用跳转。
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
              <p>你的专属链接（仅当前登录用户可见，15 分钟内有效）：</p>
              <a
                href={`${tunnelUrl}${tunnelUrl.includes("?") ? "&" : "?"}direct=1`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/30 px-4 py-3 text-emerald-300 transition-colors hover:bg-emerald-600/50 font-medium"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                一键跳转（本页会跳转到目标，请确保当前网络能访问该目标）
              </a>
              <p className="text-[11px] text-neutral-500">
                请在本页直接点击上方按钮，勿新开标签打开链接，否则可能无法带登录态。
              </p>
              <details className="text-[11px] text-neutral-500">
                <summary className="cursor-pointer text-accent-silver hover:text-accent-gold">备用方式（多数网站会拦截，仅作尝试）</summary>
                <div className="mt-2 space-y-2">
                  <a
                    href={tunnelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-accent-gold/80 hover:underline"
                  >
                    经代理在新标签打开
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowFrame((s) => !s)}
                    className="block text-accent-gold/80 hover:underline"
                  >
                    {showFrame ? "关闭" : "在页面内小窗打开"}
                  </button>
                  {showFrame && (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                      <iframe
                        title="隧道小窗"
                        src={tunnelUrl}
                        className="h-[360px] w-full border-0 bg-white"
                      />
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>

        <div className="card-elevated space-y-2 p-4 text-[11px] text-accent-silver">
          <p className="font-semibold text-neutral-light">使用与合规说明</p>
          <ul className="list-disc list-inside space-y-1">
            <li>仅对登录用户开放，需 ≥1 个有效触点；点击跳转后由你本地浏览器直连目标。</li>
            <li>严禁用于攻击、扫描、传播违法内容等用途，如有违规可随时封禁账号。</li>
            <li>本功能不提供翻墙或解封能力，能否打开目标仅取决于你当前网络是否可达该目标。</li>
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


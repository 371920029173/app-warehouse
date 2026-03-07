"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slotId: string;
  /** 仅允许 "广告" 或 "赞助链接"（AdSense 要求），不传默认 广告 */
  title?: string;
  className?: string;
  /** 点击跳转的落地页，不传则仅展示 */
  clickUrl?: string;
};

export function FakeAdSlot({ slotId, title = "广告", className = "", clickUrl }: Props) {
  const [claimed, setClaimed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    if (!clickUrl) return;
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("/api/ads/claim-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slotId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.claimed) {
        setClaimed(true);
        router.refresh();
      } else if (res.status === 200 && data.message) {
        setMessage(data.message);
      } else if (!res.ok) {
        setMessage(data.message || "请求失败，请稍后再试");
      }
    } catch {
      setMessage("网络异常，请稍后再试");
    }
    window.open(clickUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-3 text-center ${className}`}
    >
      <span className="mb-1 text-[10px] uppercase text-neutral-500">{title}</span>
      {clickUrl ? (
        <button
          type="button"
          onClick={handleClick}
          className="flex h-14 w-full items-center justify-center rounded-lg bg-neutral-700/50 text-xs text-neutral-400 transition-colors hover:bg-neutral-600/60 hover:text-accent-gold"
        >
          [ 赞助链接 ]
        </button>
      ) : (
        <div className="flex h-14 w-full items-center justify-center rounded-lg bg-neutral-700/50 text-xs text-neutral-400">
          [ 广告位 ]
        </div>
      )}
      {message && <p className="mt-1 text-[10px] text-amber-400">{message}</p>}
      {claimed && !message && <p className="mt-1 text-[10px] text-green-400">已记录</p>}
    </div>
  );
}

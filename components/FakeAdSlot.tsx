"use client";

import { useState } from "react";

type Props = {
  slotId: string;
  title?: string;
  className?: string;
  /** 点击广告跳转的落地页，不传则不可点击；仅点击才计费/领取触点 */
  clickUrl?: string;
};

export function FakeAdSlot({ slotId, title = "推荐", className = "", clickUrl }: Props) {
  const [claimed, setClaimed] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    if (!clickUrl) return;
    e.preventDefault();
    try {
      const res = await fetch("/api/ads/claim-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slotId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.claimed) setClaimed(true);
    } catch {
      // 接口失败也允许跳转
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
          [ 点击进入 ]
        </button>
      ) : (
        <div className="flex h-14 w-full items-center justify-center rounded-lg bg-neutral-700/50 text-xs text-neutral-400">
          [ 测试广告位 ]
        </div>
      )}
      {clickUrl && !claimed && (
        <p className="mt-1 text-[10px] text-amber-400">点击进入即得 1 触点（每广告位每日限 1 次）</p>
      )}
      {claimed && <p className="mt-1 text-[10px] text-green-400">已领取 1 触点</p>}
    </div>
  );
}

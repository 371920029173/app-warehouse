"use client";

import { useState } from "react";

interface Props {
  appName: string;
  appVersion: string;
}

export function FavoriteButton({ appName, appVersion }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFavorite() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/apps/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, appVersion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "收藏失败");
      setMessage("已收藏该版本");
    } catch (e: any) {
      setMessage(e.message || "发生未知错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1 text-[11px] text-accent-silver">
      <button
        type="button"
        disabled={loading}
        onClick={handleFavorite}
        className="inline-flex items-center justify-center rounded-full border border-accent-silver/50 bg-neutral-dark/70 px-3 py-1.5 text-xs text-accent-silver transition-colors hover:border-accent-gold hover:text-accent-gold disabled:opacity-60"
      >
        {loading ? "收藏中..." : "收藏该版本"}
      </button>
      {message && <p className="text-accent-gold">{message}</p>}
    </div>
  );
}


"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIEW_SECONDS = 3;

type Props = {
  slotId: string;
  title?: string;
  className?: string;
};

export function FakeAdSlot({ slotId, title = "推荐", className = "" }: Props) {
  const [viewed, setViewed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewedRef = useRef(false);

  const claim = useCallback(async () => {
    if (claimed) return;
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
      // ignore
    }
  }, [slotId, claimed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e?.isIntersecting) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setCountdown(null);
          return;
        }
        if (viewedRef.current) return;
        viewedRef.current = true;
        setViewed(true);
        setCountdown(VIEW_SECONDS);
        let left = VIEW_SECONDS;
        timerRef.current = setInterval(() => {
          left -= 1;
          setCountdown(left);
          if (left <= 0 && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            claim();
          }
        }, 1000);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [claim]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-3 text-center ${className}`}
    >
      <span className="mb-1 text-[10px] uppercase text-neutral-500">{title}</span>
      <div className="h-14 w-full rounded-lg bg-neutral-700/50 flex items-center justify-center text-xs text-neutral-400">
        [ 测试广告位 ]
      </div>
      {viewed && countdown !== null && countdown > 0 && !claimed && (
        <p className="mt-1 text-[10px] text-amber-400">有效浏览 {countdown}s 后 +1 触点</p>
      )}
      {claimed && <p className="mt-1 text-[10px] text-green-400">已领取 1 触点</p>}
    </div>
  );
}

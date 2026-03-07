"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FakeAdSlot } from "./FakeAdSlot";

const ROTATE_INTERVAL_MS = 6000;
const SLOT_IDS = Array.from({ length: 10 }, (_, i) => `flow-${i + 1}`);
/** AdSense 仅允许使用「广告」或「赞助链接」作为标签，不得使用误导性标题 */
const SLOT_LABEL = "广告";

/** 每个广告位点击跳转的落地页，可后续改为后台配置 */
const SLOT_CLICK_URLS: (string | undefined)[] = [
  "https://www.cloudflare.com/products/zero-trust/",
  "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/",
  "https://www.cloudflare.com/products/zero-trust/",
  "https://developers.cloudflare.com/",
  "https://www.cloudflare.com/products/zero-trust/",
  "https://developers.cloudflare.com/",
  "https://www.cloudflare.com/",
  "https://www.cloudflare.com/products/zero-trust/",
  "https://developers.cloudflare.com/",
  "https://www.cloudflare.com/",
];

/** 广告框不可折叠，预留 10 个位置，每 6 秒切换下一个 */
export function AdBar() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());
  const progressRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % SLOT_IDS.length);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(goNext, ROTATE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(100, (elapsed / ROTATE_INTERVAL_MS) * 100);
      setProgress(p);
      if (p < 100) progressRef.current = requestAnimationFrame(animate);
    };
    progressRef.current = requestAnimationFrame(animate);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [index]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-black/20">
      <div className="px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          广告 · 每 6 秒切换
        </p>
      </div>
      <div className="px-3 pb-3 pt-0">
        <div className="relative h-[90px] overflow-hidden rounded-xl">
          {SLOT_IDS.map((slotId, i) => (
            <div
              key={slotId}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{
                opacity: i === index ? 1 : 0,
                pointerEvents: i === index ? "auto" : "none",
              }}
            >
              <FakeAdSlot
                slotId={slotId}
                title={SLOT_LABEL}
                className="h-full min-h-0"
                clickUrl={SLOT_CLICK_URLS[i]}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 h-0.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500/80 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

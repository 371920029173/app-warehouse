"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FakeAdSlot } from "./FakeAdSlot";

const ROTATE_INTERVAL_MS = 7000;
const SLOT_IDS = ["flow-1", "flow-2", "flow-3", "flow-4", "flow-5"];
const SLOT_LABELS = ["推荐", "热门应用", "限时福利", "精选工具", "新品上架"];

/** 全站只有一个广告展示框，每 7 秒切换一条 */
export function AdBar() {
  const [collapsed, setCollapsed] = useState(false);
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
    if (collapsed) return;
    timerRef.current = setInterval(goNext, ROTATE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [collapsed, goNext]);

  useEffect(() => {
    if (collapsed) return;
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
  }, [collapsed, index]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-neutral-300"
      >
        <span>广告 · 每 7 秒切换 · 有效浏览 3 秒得 1 触点</span>
        {collapsed ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
      </button>
      {!collapsed && (
        <div className="px-3 pb-3 pt-1">
          {/* 唯一一个展示框，内容每 7 秒切换 */}
          <div className="relative h-[90px] overflow-hidden rounded-xl">
            {SLOT_IDS.map((slotId, i) => (
              <div
                key={slotId}
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: i === index ? 1 : 0,
                  pointerEvents: i === index ? "auto" : "none",
                }}
              >
                <FakeAdSlot
                  slotId={slotId}
                  title={SLOT_LABELS[i]}
                  className="h-full min-h-0"
                />
              </div>
            ))}
          </div>
          <div className="mt-2 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500/80 transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FakeAdSlot } from "./FakeAdSlot";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const SLOTS = Array.from({ length: 8 }, (_, i) => `bar-${i + 1}`);

export function AdBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-neutral-300"
      >
        <span>广告栏（有效浏览 3 秒可获得 1 触点）</span>
        {collapsed ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronUpIcon className="h-4 w-4" />
        )}
      </button>
      {!collapsed && (
        <div className="grid grid-cols-4 gap-2 p-3 md:grid-cols-8">
          {SLOTS.map((id) => (
            <FakeAdSlot key={id} slotId={id} title={`位 ${id.replace("bar-", "")}`} />
          ))}
        </div>
      )}
    </div>
  );
}

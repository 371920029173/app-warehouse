"use client";

import { usePathname } from "next/navigation";
import { AdBar } from "@/components/AdBar";

/** 登录页不展示广告栏 */
export function ConditionalAdBar() {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  return (
    <div className="border-b border-white/5 px-4 py-2 md:px-6">
      <AdBar />
    </div>
  );
}

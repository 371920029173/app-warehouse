"use client";

import { useEffect, useState } from "react";

export function GateRedirect({ url }: { url: string }) {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = url;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, url]);

  return (
    <div className="layout-shell max-w-md text-center">
      <div className="card-elevated space-y-4 p-6">
        <p className="text-sm font-medium text-neutral-light">
          隧道已验证，正在打开目标站点…
        </p>
        <p className="text-xs text-accent-silver">
          {countdown} 秒后自动跳转，或{" "}
          <a
            href={url}
            className="text-accent-gold hover:underline"
            rel="noreferrer noopener"
          >
            立即打开
          </a>
        </p>
        <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-accent-gold/80 transition-[width] duration-1000"
            style={{ width: `${((2 - countdown) / 2) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

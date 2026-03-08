"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type User = { id?: string; email?: string; name?: string } | null;

export function HeaderNav() {
  const [user, setUser] = useState<User>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="flex items-center gap-3 text-xs md:gap-4 md:text-sm">
      <Link
        href="/apps"
        className="text-neutral-light/80 transition-colors duration-200 hover:text-neutral-light"
      >
        应用仓库
      </Link>
      <Link
        href="/apps/search"
        className="flex items-center gap-1.5 text-neutral-light/80 transition-colors duration-200 hover:text-neutral-light"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        搜索
      </Link>
      <Link
        href="/account"
        className="text-neutral-light/80 transition-colors duration-200 hover:text-neutral-light"
      >
        我的
      </Link>
      {mounted &&
        (user?.id ? (
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
              window.location.href = "/";
            }}
            className="btn-secondary"
          >
            退出登录
          </button>
        ) : (
          <Link href="/login" className="btn-secondary">
            登录 / 注册
          </Link>
        ))}
    </nav>
  );
}

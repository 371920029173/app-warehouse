"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "register") {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "注册失败");
        setMessage("注册成功，请继续登录。");
        setMode("login");
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "登录失败");
        setMessage("登录成功，即将跳转。");
        window.location.href = "/account";
      }
    } catch (e: unknown) {
      setMessage((e as Error).message || "发生未知错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-120px)] items-center justify-center overflow-hidden px-4 py-8">
      {/* 背景装饰：渐变光球 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-amber-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-sky-600/15 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[80px]" />
      </div>

      <div className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl md:min-h-[520px]">
        {/* 左侧：品牌与欢迎语（参考 CareerCompass） */}
        <div className="hidden w-full flex-col justify-between bg-gradient-to-br from-amber-900/40 via-neutral-900/50 to-sky-900/30 p-8 md:flex md:max-w-[42%]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-neutral-light/90 hover:text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-sm font-bold text-amber-400">AW</span>
              <span className="font-semibold tracking-wide">AppWarehouse</span>
            </Link>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              {mode === "login" ? "欢迎回来" : "加入我们"}
            </h1>
            <p className="max-w-sm text-sm text-neutral-300">
              {mode === "login"
                ? "登录后可同步收藏、触点余额与 Cloudflare 隧道使用记录。"
                : "注册即享应用仓库与隧道能力，邀请好友还可获得更多触点。"}
            </p>
          </div>
          <p className="text-xs text-neutral-500">
            <Link href="/" className="text-amber-400/80 hover:text-amber-400">返回首页</Link>
            {" · "}
            <Link href="/apps" className="text-amber-400/80 hover:text-amber-400">应用仓库</Link>
          </p>
        </div>

        {/* 右侧：表单 */}
        <div className="flex w-full flex-col justify-center p-6 md:p-10 md:max-w-[58%]">
          <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1 text-sm md:mb-8">
            <button
              type="button"
              onClick={() => { setMode("login"); setMessage(null); }}
              className={`flex-1 rounded-full px-4 py-2 transition-all duration-200 ${
                mode === "login"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setMessage(null); }}
              className={`flex-1 rounded-full px-4 py-2 transition-all duration-200 ${
                mode === "register"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-neutral-400">昵称（可选）</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="你的展示名称"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-400">密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
                placeholder="至少 8 位，建议包含字母与数字"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 disabled:opacity-60"
            >
              {loading
                ? mode === "login"
                  ? "登录中..."
                  : "注册中..."
                : mode === "login"
                ? "登录"
                : "创建账户"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-amber-400">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-xs text-neutral-500">
            {mode === "login" ? "还没有账户？" : "已有账户？"}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(null); }}
              className="ml-1 text-amber-400 hover:underline"
            >
              {mode === "login" ? "立即注册" : "去登录"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

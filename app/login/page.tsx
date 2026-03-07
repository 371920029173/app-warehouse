"use client";

import { FormEvent, useState } from "react";

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
    } catch (e: any) {
      setMessage(e.message || "发生未知错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-gradient-to-br from-brand-primary via-black to-neutral-dark px-4">
      <div className="card-elevated relative w-full max-w-md overflow-hidden border border-accent-silver/30 bg-gradient-to-br from-neutral-dark/90 via-black/90 to-brand-primary/90 p-6 md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_55%)]" />
        <div className="relative space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-semibold text-neutral-light">
              AppWarehouse 账户
            </h1>
            <p className="text-xs text-accent-silver">
              登录后可同步收藏、触点余额与 Cloudflare 隧道使用记录。
            </p>
          </div>

          <div className="flex rounded-full border border-accent-silver/40 bg-neutral-dark/70 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
                mode === "login"
                  ? "bg-accent-gold text-black"
                  : "text-accent-silver"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
                mode === "register"
                  ? "bg-accent-gold text-black"
                  : "text-accent-silver"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === "register" && (
              <label className="space-y-1 text-accent-silver">
                <span>昵称（可选）</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-accent-silver/40 bg-neutral-dark/70 px-3 py-2 text-sm text-neutral-light outline-none transition-colors focus:border-accent-gold"
                  placeholder="你的展示名称"
                />
              </label>
            )}
            <label className="space-y-1 text-accent-silver">
              <span>邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-accent-silver/40 bg-neutral-dark/70 px-3 py-2 text-sm text-neutral-light outline-none transition-colors focus:border-accent-gold"
                placeholder="you@example.com"
              />
            </label>
            <label className="space-y-1 text-accent-silver">
              <span>密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-accent-silver/40 bg-neutral-dark/70 px-3 py-2 text-sm text-neutral-light outline-none transition-colors focus:border-accent-gold"
                placeholder="至少 8 位，建议包含字母与数字"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex w-full justify-center"
            >
              {loading
                ? mode === "login"
                  ? "登录中..."
                  : "注册中..."
                : mode === "login"
                ? "使用邮箱登录"
                : "创建新账户"}
            </button>
          </form>

          <div className="space-y-2 text-[11px] text-accent-silver">
            {message && (
              <p className="text-center text-[11px] text-accent-gold">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


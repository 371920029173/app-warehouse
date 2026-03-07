"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AnimatedCharacters } from "@/components/login/AnimatedCharacters";
import { InteractiveHoverButton } from "@/components/login/InteractiveHoverButton";

/**
 * 登录/注册页：全面照搬 CareerCompass
 * https://careercompassai.vercel.app/login
 * 左：品牌 + 动画角色（眼球跟随、眨眼、输入时对视、密码可见时偷看）+ 欢迎语 + 底部链接
 * 右：登录/注册 分段 + 表单 + 悬停动效按钮
 */
export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
    <div className="grid min-h-[calc(100vh-60px)] md:grid-cols-2">
      {/* 左侧：品牌 + 动画角色 + 欢迎语 + 底部链接（CareerCompass 同款） */}
      <div className="flex flex-col justify-between border-b border-white/10 bg-neutral-900/80 p-8 md:border-b-0 md:border-r">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
              AW
            </span>
            <span className="text-lg font-semibold text-white">AppWarehouse</span>
          </Link>
        </div>

        {/* 动画角色：鼠标跟随、眨眼、输入时对视、密码可见时紫色偷看（小屏隐藏） */}
        <div className="hidden min-h-[400px] justify-center overflow-hidden py-4 md:flex">
          <AnimatedCharacters
            isTyping={isTyping}
            showPassword={showPassword}
            passwordLength={password.length}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {mode === "login" ? "欢迎回来" : "加入我们"}
          </h1>
          <p className="text-sm text-neutral-400">
            {mode === "login" ? "请填写登录信息" : "请填写注册信息"}
          </p>
        </div>
        <div className="flex gap-4 text-xs text-neutral-500">
          <Link href="/legal/privacy" className="text-amber-400/90 hover:text-amber-400">
            隐私政策
          </Link>
          <Link href="/legal/terms" className="text-amber-400/90 hover:text-amber-400">
            用户协议
          </Link>
        </div>
      </div>

      {/* 右侧：表单 + 互动按钮（CareerCompass 同款） */}
      <div className="flex flex-col justify-center p-8 md:p-12">
        <Link href="/" className="mb-6 flex items-center gap-2 md:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-xs font-bold text-white">
            AW
          </span>
          <span className="font-semibold text-white">AppWarehouse</span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex rounded-lg bg-white/5 p-0.5 text-sm">
            <button
              type="button"
              onClick={() => { setMode("login"); setMessage(null); }}
              className={`flex-1 rounded-md py-2.5 font-medium transition-colors ${
                mode === "login" ? "bg-amber-500 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setMessage(null); }}
              className={`flex-1 rounded-md py-2.5 font-medium transition-colors ${
                mode === "register" ? "bg-amber-500 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-neutral-300">昵称（可选）</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-500/50"
                  placeholder="你的展示名称"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-neutral-300">邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-500/50"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-neutral-300">密码</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-500/50"
                  placeholder="至少 8 位，建议包含字母与数字"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-neutral-400 transition hover:text-white"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>
            <div className="pt-1">
              <InteractiveHoverButton
                type="submit"
                disabled={loading}
                text={loading ? (mode === "login" ? "登录中..." : "注册中...") : (mode === "login" ? "登录" : "创建账户")}
                className="w-full disabled:opacity-60"
              >
                {loading
                  ? (mode === "login" ? "登录中..." : "注册中...")
                  : (mode === "login" ? "登录" : "创建账户")}
              </InteractiveHoverButton>
            </div>
          </form>

          {message && <p className="mt-3 text-center text-sm text-amber-400">{message}</p>}

          <p className="mt-6 text-center text-sm text-neutral-500">
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

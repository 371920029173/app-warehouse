"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  }
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-xs text-accent-silver underline transition-colors hover:text-accent-gold"
    >
      退出登录
    </button>
  );
}

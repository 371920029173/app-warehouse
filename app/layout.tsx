import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConditionalAdBar } from "@/components/LayoutWithAd";
import { HeaderNav } from "@/components/HeaderNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AppWarehouse · 通用应用仓库与触点隧道",
  description:
    "AppWarehouse 是基于 Cloudflare 免费生态构建的通用应用仓库与 Cloudflare 隧道平台，支持应用分类导航、版本跳转、触点货币体系与广告变现。",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} app-bg text-neutral-light`}>
        <div className="relative flex min-h-screen flex-col">
          <header className="border-b border-accent-silver/20 bg-brand-primary/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-silver/70 bg-neutral-dark/70 text-xs font-semibold tracking-[0.18em] uppercase">
                  AW
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide">
                    AppWarehouse
                  </span>
                  <span className="text-xs text-accent-silver">
                    通用应用仓库 · 隧道
                  </span>
                </div>
              </a>
              <HeaderNav />
            </div>
          </header>
          <ConditionalAdBar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-accent-silver/20 bg-neutral-dark/80">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-accent-silver md:flex-row md:px-6">
              <p>© {new Date().getFullYear()} AppWarehouse · 通用应用仓库与触点隧道</p>
              <div className="flex flex-wrap items-center gap-3">
                <span>部署于 Cloudflare Pages</span>
                <a
                  href="/legal/privacy"
                  className="hover:text-accent-gold transition-colors"
                >
                  隐私政策
                </a>
                <a
                  href="/legal/terms"
                  className="hover:text-accent-gold transition-colors"
                >
                  用户协议
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}


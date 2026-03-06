import { nextOnPages } from "@cloudflare/next-on-pages/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  }
};

export default nextOnPages(nextConfig);


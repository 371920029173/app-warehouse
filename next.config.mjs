import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // Edge/Cloudflare Pages: polyfill Node crypto for bcrypt; vm not available in Edge
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      vm: path.resolve(__dirname, 'lib/empty-shim.js'),
    };
    return config;
  },
};

export default nextConfig;


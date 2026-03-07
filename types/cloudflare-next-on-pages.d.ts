/**
 * Shim so TypeScript resolves @cloudflare/next-on-pages when Next forces moduleResolution: "node".
 * Also provides Cloudflare binding types so lib/db.ts type-checks without @cloudflare/workers-types.
 */
declare module "@cloudflare/next-on-pages" {
  export function getRequestContext(): { env: unknown };
  export function getOptionalRequestContext(): undefined | { env: unknown };
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(col?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Result<T = unknown> {
  results: T[];
  success?: boolean;
  error?: string;
  meta?: unknown;
}

interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<string | unknown | ArrayBuffer | ReadableStream | null>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expirationTtl?: number; metadata?: unknown }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
}

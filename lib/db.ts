import { getRequestContext } from "@cloudflare/next-on-pages";

export type EnvBindings = {
  DB: D1Database;
  APP_KV: KVNamespace;
};

export function getEnv(): EnvBindings {
  const { env } = getRequestContext();
  return env as unknown as EnvBindings;
}

export function getDB(): D1Database {
  return getEnv().DB;
}


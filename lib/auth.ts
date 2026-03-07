import { cookies } from "next/headers";

const SESSION_COOKIE = "appwarehouse.session";
const SECRET = process.env.NEXTAUTH_SECRET || "change-me-in-production";
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

export type Session = {
  user: SessionUser;
} | null;

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function hmacSign(message: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
}

async function hmacVerify(message: string, signature: ArrayBuffer): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    new TextEncoder().encode(message)
  );
}

export async function encodeSession(payload: SessionUser): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const data = { ...payload, exp };
  const payloadStr = JSON.stringify(data);
  const payloadB64 = toBase64Url(new TextEncoder().encode(payloadStr).buffer);
  const sig = await hmacSign(payloadB64);
  const sigB64 = toBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function decodeSession(cookieValue: string): Promise<SessionUser | null> {
  const dot = cookieValue.indexOf(".");
  if (dot === -1) return null;
  const payloadB64 = cookieValue.slice(0, dot);
  const sigB64 = cookieValue.slice(dot + 1);
  try {
    const sig = fromBase64Url(sigB64);
    const ok = await hmacVerify(payloadB64, sig.buffer as ArrayBuffer);
    if (!ok) return null;
    const raw = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const decoded = new TextDecoder().decode(bytes);
    const data = JSON.parse(decoded) as { id: string; email: string; name?: string | null; exp: number };
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: data.id, email: data.email, name: data.name ?? null };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  const user = await decodeSession(value);
  if (!user) return null;
  return { user };
}

/** Same shape as getServerSession for drop-in replacement. */
export async function auth(): Promise<Session> {
  return getSession();
}

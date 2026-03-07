/**
 * 隧道闸门用短期 token：直接跳转时先到 /tunnel/go?t=token，验证后再跳目标，避免裸链接体验。
 * token = base64url(payload) + '.' + base64url(hmac(payload)), payload = { id, url, exp }
 */

const GATE_SECRET =
  process.env.TUNNEL_GATE_SECRET || "tunnel-gate-dev-change-in-production";
const TTL_MS = 5 * 60 * 1000; // 5 分钟有效

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

export type GatePayload = {
  id: string;
  url: string;
  exp: number;
};

async function hmacSign(message: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(GATE_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
}

async function hmacVerify(message: string, signature: ArrayBuffer): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(GATE_SECRET),
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

export async function createTunnelGateToken(id: string, url: string): Promise<string> {
  const payload: GatePayload = {
    id,
    url,
    exp: Date.now() + TTL_MS,
  };
  const payloadStr = JSON.stringify(payload);
  const sig = await hmacSign(payloadStr);
  return toBase64Url(new TextEncoder().encode(payloadStr).buffer) + "." + toBase64Url(sig);
}

export async function verifyTunnelGateToken(
  token: string
): Promise<GatePayload | null> {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  let payloadStr: string;
  try {
    payloadStr = new TextDecoder().decode(fromBase64Url(payloadB64));
  } catch {
    return null;
  }
  const sigBuf = fromBase64Url(sigB64).buffer;
  const ok = await hmacVerify(payloadStr, sigBuf);
  if (!ok) return null;
  let payload: GatePayload;
  try {
    payload = JSON.parse(payloadStr) as GatePayload;
  } catch {
    return null;
  }
  if (payload.exp < Date.now() || !payload.url || !/^https?:\/\//.test(payload.url))
    return null;
  return payload;
}

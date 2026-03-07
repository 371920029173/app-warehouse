import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "edge";

const MAX_HTML_REWRITE = 2 * 1024 * 1024; // 2MB，超过则不重写链接

/** 重写 HTML 内链接，使点击后继续走本代理，实现「梯子」：仅本页及由此打开的页面经代理 */
function rewriteHtmlLinks(
  html: string,
  proxyBase: string,
  baseUrl: string
): string {
  const base = new URL(baseUrl);
  const baseOrigin = base.origin;

  function toProxyUrl(url: string): string {
    return proxyBase + encodeURIComponent(url);
  }

  function rewriteAttr(
    attr: "href" | "src" | "action",
    body: string
  ): string {
    // 绝对 http(s) 链接
    body = body.replace(
      new RegExp(attr + '="(https?:\\/\\/[^"]*)"', "gi"),
      (_, url) => attr + '="' + toProxyUrl(url) + '"'
    );
    // 绝对路径 /path
    body = body.replace(
      new RegExp(attr + '="(\\/[^"]*)"', "gi"),
      (_, path) => attr + '="' + toProxyUrl(baseOrigin + path) + '"'
    );
    // 相对路径（不含 # 开头、不含 //、不含 http:）
    body = body.replace(
      new RegExp(attr + '="((?!https?:)(?!//)(?!#)[^"]*)"', "gi"),
      (_, rel) => attr + '="' + toProxyUrl(new URL(rel, baseUrl).href) + '"'
    );
    return body;
  }

  let out = html;
  out = rewriteAttr("href", out);
  out = rewriteAttr("src", out);
  out = rewriteAttr("action", out);
  return out;
}

/**
 * 软隧道代理：梯子效果 = 本页及由此打开的页面均经代理
 * - 3xx Location 重写为经本代理
 * - 200 text/html 内链接重写为经本代理，点击后继续走隧道
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json(
      { message: "需要先登录才能使用隧道功能" },
      { status: 401 }
    );
  }

  const reqUrl = new URL(req.url);
  const id = reqUrl.searchParams.get("id");
  const targetUrl = reqUrl.searchParams.get("url");

  if (!id || !targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return NextResponse.json({ message: "参数无效" }, { status: 400 });
  }

  const db = getDB();

  const record = await db
    .prepare(
      "SELECT * FROM tunnel_usage WHERE id = ? AND user_id = ? ORDER BY start_time DESC LIMIT 1"
    )
    .bind(id, userId)
    .first<{
      id: string;
      user_id: string;
      start_time: string;
      end_time: string | null;
    }>();

  if (!record) {
    return NextResponse.json(
      { message: "未找到隧道会话或无权限访问" },
      { status: 404 }
    );
  }

  const now = Date.now();
  const end =
    record.end_time != null
      ? new Date(record.end_time).getTime()
      : new Date(record.start_time).getTime() + 15 * 60 * 1000;

  if (now > end) {
    return NextResponse.json(
      { message: "隧道会话已过期，请重新开启" },
      { status: 410 }
    );
  }

  // 直接跳转：校验通过后 302 到目标，由用户浏览器直连，不易被目标站拦截（无闸门页、无 token，实现最简）
  if (reqUrl.searchParams.get("direct") === "1") {
    return NextResponse.redirect(targetUrl, 302);
  }

  // 请求头与真人一致：直接转发用户浏览器发给我们的头（Cookie/Origin 等除外），目标站看到的头 = 你浏览器发出的
  const targetOrigin = new URL(targetUrl).origin;
  const forwardHeaders = new Headers();
  const forwardNames = [
    "user-agent",
    "accept",
    "accept-language",
    "accept-encoding",
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
    "sec-fetch-dest",
    "sec-fetch-mode",
    "sec-fetch-site",
    "sec-fetch-user",
    "cache-control",
    "pragma",
    "upgrade-insecure-requests",
    "dnt",
    "priority",
  ];
  for (const name of forwardNames) {
    const v = req.headers.get(name);
    if (v) forwardHeaders.set(name, v);
  }
  // 无则补默认，保证必选头存在
  if (!forwardHeaders.has("user-agent"))
    forwardHeaders.set(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );
  if (!forwardHeaders.has("accept"))
    forwardHeaders.set(
      "accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    );
  if (!forwardHeaders.has("accept-encoding"))
    forwardHeaders.set("accept-encoding", "gzip, deflate, br");
  // Referer 用目标站首页，避免把本站域名带给目标站
  forwardHeaders.set("Referer", targetOrigin + "/");

  const upstreamRes = await fetch(targetUrl, {
    headers: forwardHeaders,
    redirect: "manual", // 不自动跟随重定向，由我们改写 Location 后交给浏览器
  });

  const headers = new Headers(upstreamRes.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.delete("Set-Cookie");
  headers.delete("set-cookie");

  // 重写 3xx Location，使重定向继续通过本代理（隧道内跳转）
  const status = upstreamRes.status;
  if (status >= 300 && status < 400) {
    const location = upstreamRes.headers.get("location");
    if (location) {
      const resolved = new URL(location, targetUrl).href;
      if (/^https?:\/\//i.test(resolved)) {
        const proxyUrl = new URL(reqUrl.pathname, reqUrl.origin);
        proxyUrl.searchParams.set("id", id);
        proxyUrl.searchParams.set("url", resolved);
        headers.set("Location", proxyUrl.toString());
      }
    }
  }

  // 200 HTML：重写页面内链接，使点击后继续走本代理（梯子 = 仅本页及由此打开的页面）
  const contentType = upstreamRes.headers.get("content-type") || "";
  if (
    status === 200 &&
    contentType.toLowerCase().includes("text/html")
  ) {
    const raw = await upstreamRes.text();
    headers.delete("content-encoding");
    if (raw.length <= MAX_HTML_REWRITE) {
      const proxyUrl = new URL(reqUrl.pathname, reqUrl.origin);
      const proxyBase =
        proxyUrl.origin +
        proxyUrl.pathname +
        "?id=" +
        encodeURIComponent(id) +
        "&url=";
      const rewritten = rewriteHtmlLinks(raw, proxyBase, targetUrl);
      headers.set(
        "Content-Length",
        String(new TextEncoder().encode(rewritten).length)
      );
      return new NextResponse(rewritten, { status, headers });
    }
    // 过大不重写，直接返回原文
    headers.set("Content-Length", String(new TextEncoder().encode(raw).length));
    return new NextResponse(raw, { status, headers });
  }

  // 非 HTML：流式透传
  return new NextResponse(upstreamRes.body, {
    status,
    headers,
  });
}


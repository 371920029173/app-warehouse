import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "edge";

/**
 * 软隧道代理：基于 Cloudflare 边缘的受控代理（参考 Workers Streams API 与反向代理最佳实践）
 * - 流式透传响应体，不整包缓冲
 * - 重写 3xx Location，使重定向继续走本代理，隧道内跳转不离开
 * - 使用常见浏览器头并可选转发客户端头，降低目标站人机校验
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

  // 构建上游请求头：优先使用客户端头（更像真实浏览器），缺失时用默认值
  const forwardHeaders = new Headers();
  forwardHeaders.set(
    "User-Agent",
    req.headers.get("user-agent") ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  );
  forwardHeaders.set(
    "Accept",
    req.headers.get("accept") ||
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
  );
  forwardHeaders.set(
    "Accept-Language",
    req.headers.get("accept-language") || "zh-CN,zh;q=0.9,en;q=0.8"
  );
  forwardHeaders.set("Accept-Encoding", "gzip, deflate, br");
  forwardHeaders.set("Cache-Control", "no-cache");
  forwardHeaders.set("Pragma", "no-cache");
  forwardHeaders.set("Upgrade-Insecure-Requests", "1");
  const secFetch = req.headers.get("sec-fetch-dest");
  if (secFetch) forwardHeaders.set("Sec-Fetch-Dest", secFetch);
  if (req.headers.get("sec-fetch-mode"))
    forwardHeaders.set("Sec-Fetch-Mode", req.headers.get("sec-fetch-mode")!);
  if (req.headers.get("sec-fetch-site"))
    forwardHeaders.set("Sec-Fetch-Site", req.headers.get("sec-fetch-site")!);

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

  // 流式透传响应体（Cloudflare Workers/Edge 推荐：Response(body, { headers })，不缓冲）
  return new NextResponse(upstreamRes.body, {
    status,
    headers,
  });
}


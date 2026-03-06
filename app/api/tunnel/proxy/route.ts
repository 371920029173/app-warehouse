import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json(
      { message: "需要先登录才能使用隧道功能" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const targetUrl = searchParams.get("url");

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

  // 软隧道实现：基于 Cloudflare 边缘网络的受控代理
  const upstreamRes = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AppWarehouse-Tunnel/1.0; +https://example.com)",
    },
  });

  const headers = new Headers(upstreamRes.headers);
  headers.set("access-control-allow-origin", "*");
  headers.delete("set-cookie");

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers,
  });
}


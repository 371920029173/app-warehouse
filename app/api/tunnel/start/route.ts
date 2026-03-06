import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json(
      { message: "需要先登录才能使用隧道功能" },
      { status: 401 }
    );
  }

  const { targetUrl } = (await req.json().catch(() => ({}))) as {
    targetUrl?: string;
  };

  if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return NextResponse.json(
      { message: "请输入合法的 http/https 网址" },
      { status: 400 }
    );
  }

  const db = getDB();

  // 检查用户触点余额
  const balanceStmt = await db
    .prepare(
      "SELECT COALESCE(SUM(amount), 0) as balance FROM points WHERE user_id = ?"
    )
    .bind(userId)
    .first<{ balance: number }>();
  const balance = balanceStmt?.balance ?? 0;

  if (balance < 1) {
    return NextResponse.json(
      { message: "触点不足，无法开启隧道" },
      { status: 402 }
    );
  }

  const now = new Date();
  const end = new Date(now.getTime() + 15 * 60 * 1000);
  const usageId = uuidv4();

  // 记录隧道使用记录与扣除触点（事务在 D1 中通过 batch 模拟）
  const batch = [
    db
      .prepare(
        "INSERT INTO tunnel_usage (id, user_id, start_time, end_time, points_consumed, auto_renew) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(
        usageId,
        userId,
        now.toISOString(),
        end.toISOString(),
        1,
        false
      ),
    db
      .prepare(
        "INSERT INTO points (id, user_id, amount, type, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(uuidv4(), userId, -1, "tunnel_use", now.toISOString())
  ];

  await db.batch(batch);

  const tunnelUrl = `/api/tunnel/proxy?id=${encodeURIComponent(
    usageId
  )}&url=${encodeURIComponent(targetUrl)}`;

  return NextResponse.json({ tunnelUrl });
}


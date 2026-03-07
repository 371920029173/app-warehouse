import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";

const VALID_SLOTS = new Set([
  "bar-1", "bar-2", "bar-3", "bar-4", "bar-5", "bar-6", "bar-7", "bar-8",
  "popup-tunnel",
  ...Array.from({ length: 10 }, (_, i) => `flow-${i + 1}`),
]);

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json(
      { message: "请先登录后再通过点击广告获取触点" },
      { status: 401 }
    );
  }

  const { slotId } = (await req.json().catch(() => ({}))) as { slotId?: string };
  if (!slotId || !VALID_SLOTS.has(slotId)) {
    return NextResponse.json(
      { message: "无效的广告位" },
      { status: 400 }
    );
  }

  const db = getDB();
  const today = new Date().toISOString().slice(0, 10);
  const type = `ad_view_${slotId}`;

  const existing = await db
    .prepare(
      "SELECT 1 FROM points WHERE user_id = ? AND type = ? AND date(created_at) = ? LIMIT 1"
    )
    .bind(userId, type, today)
    .first();

  if (existing) {
    return NextResponse.json(
      { message: "该广告位今日已领取过触点", claimed: false },
      { status: 200 }
    );
  }

  await db
    .prepare(
      "INSERT INTO points (id, user_id, amount, type, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(uuidv4(), userId, 1, type, new Date().toISOString())
    .run();

  return NextResponse.json({ ok: true, claimed: true, message: "已获得 1 触点" });
}

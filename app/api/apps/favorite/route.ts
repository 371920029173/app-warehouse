import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    return NextResponse.json(
      { message: "请先登录再收藏应用" },
      { status: 401 }
    );
  }

  const { appName, appVersion } = (await req.json().catch(() => ({}))) as {
    appName?: string;
    appVersion?: string;
  };

  if (!appName || !appVersion) {
    return NextResponse.json(
      { message: "缺少应用名称或版本" },
      { status: 400 }
    );
  }

  const db = getDB();
  const now = new Date().toISOString();

  await db
    .prepare(
      "INSERT INTO app_collections (id, user_id, app_name, app_version, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(uuidv4(), userId, appName, appVersion, now)
    .run();

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    return NextResponse.json(
      { message: "请先登录再取消收藏" },
      { status: 401 }
    );
  }

  const { appName, appVersion } = (await req.json().catch(() => ({}))) as {
    appName?: string;
    appVersion?: string;
  };

  if (!appName || !appVersion) {
    return NextResponse.json(
      { message: "缺少应用名称或版本" },
      { status: 400 }
    );
  }

  const db = getDB();

  await db
    .prepare(
      "DELETE FROM app_collections WHERE user_id = ? AND app_name = ? AND app_version = ?"
    )
    .bind(userId, appName, appVersion)
    .run();

  return NextResponse.json({ ok: true });
}


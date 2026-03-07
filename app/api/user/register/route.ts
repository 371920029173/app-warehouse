import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { email, password, name, ref } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    name?: string;
    ref?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { message: "邮箱与密码不能为空" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "密码长度至少 8 位" },
      { status: 400 }
    );
  }

  const db = getDB();

  const existing = await db
    .prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
    .bind(email)
    .first<{ id: string }>();

  if (existing) {
    return NextResponse.json(
      { message: "该邮箱已注册，请直接登录" },
      { status: 409 }
    );
  }

  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  const statements = [
    db
      .prepare(
        "INSERT INTO users (id, email, password_hash, name, referral_id, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(userId, email, passwordHash, name ?? null, ref ?? null, now)
  ];

  // 处理邀请逻辑：如果 ref 存在，记一条 referrals 记录并给邀请人加触点
  if (ref) {
    const referralId = uuidv4();
    statements.push(
      db
        .prepare(
          "INSERT INTO referrals (id, inviter_user_id, invited_user_id, click_count, signup_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(referralId, ref, userId, 1, now, now)
    );
    statements.push(
      db
        .prepare(
          "INSERT INTO points (id, user_id, amount, type, created_at) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(uuidv4(), ref, 5, "invite_signup", now)
    );
  }

  await db.batch(statements);

  return NextResponse.json({ ok: true, userId });
}


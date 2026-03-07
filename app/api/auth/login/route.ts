import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { encodeSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "edge";

const SESSION_COOKIE = "appwarehouse.session";
const MAX_AGE = 30 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { message: "邮箱与密码不能为空" },
      { status: 400 }
    );
  }

  const db = getDB();
  const row = await db
    .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ? LIMIT 1")
    .bind(email)
    .first<{
      id: string;
      email: string;
      name: string | null;
      password_hash: string | null;
    }>();

  if (!row || !row.password_hash) {
    return NextResponse.json(
      { message: "邮箱或密码错误" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) {
    return NextResponse.json(
      { message: "邮箱或密码错误" },
      { status: 401 }
    );
  }

  const token = await encodeSession({
    id: row.id,
    email: row.email,
    name: row.name,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}

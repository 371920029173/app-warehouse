import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    Credentials({
      id: "email-login",
      name: "邮箱登录",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const db = getDB();
        const row = await db
          .prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
          .bind(email)
          .first<{
            id: string;
            email: string;
            password_hash: string | null;
            name: string | null;
          }>();

        if (!row || !row.password_hash) return null;
        const ok = await bcrypt.compare(password, row.password_hash);
        if (!ok) return null;

        return {
          id: row.id,
          email: row.email,
          name: row.name ?? undefined,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const nextAuthHandler = NextAuth(authConfig);

export const handler = nextAuthHandler;
export async function auth() {
  return getServerSession(authConfig);
}


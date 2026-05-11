import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db/knex";
import { env } from "@/lib/env.server";
import { verifyPassword } from "@/lib/auth/password";

declare module "next-auth" {
  interface User {
    role: "admin" | "user";
  }

  interface Session {
    user: {
      id: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(raw) {
        const parsed = LoginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await db("users")
          .select("id", "name", "email", "password_hash", "role")
          .where({ email: parsed.data.email.toLowerCase() })
          .first<{
            id: string;
            name: string;
            email: string;
            password_hash: string;
            role: "admin" | "user";
          }>();

        if (!user) return null;

        const isValid = await verifyPassword(parsed.data.password, user.password_hash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        (token as typeof token & { role?: "admin" | "user" }).role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.role =
          (token as typeof token & { role?: "admin" | "user" }).role === "admin"
            ? "admin"
            : "user";
      }
      return session;
    },
  },
});

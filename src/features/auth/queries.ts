import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db/knex";

export const getCurrentSession = cache(async function getCurrentSession() {
  return auth();
});

export const getCurrentUserRecord = cache(async function getCurrentUserRecord() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return null;

  return db("users")
    .select("id", "name", "email", "role", "created_at")
    .where({ id: session.user.id })
    .first<{
      id: string;
      name: string;
      email: string;
      role: "admin" | "user";
      created_at: Date;
    }>();
});

export async function requireCurrentUserRecord(loginMessage?: string) {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    redirect(`/login?error=${encodeURIComponent(loginMessage ?? "Faça login para continuar.")}`);
  }

  const user = await db("users")
    .select("id", "name", "email", "role", "created_at")
    .where({ id: session.user.id })
    .first<{
      id: string;
      name: string;
      email: string;
      role: "admin" | "user";
      created_at: Date;
    }>();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Sua sessão ficou inválida após alteração no banco. Entre novamente.",
      )}`,
    );
  }

  return user;
}

"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db/knex";
import { env } from "@/lib/env.server";
import { hashPassword } from "@/lib/auth/password";

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/hoje",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/login?error=${encodeURIComponent("Credenciais inválidas.")}`);
    }
    throw error;
  }
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = getFormValue(formData, "name");
  const email = getFormValue(formData, "email").toLowerCase();
  const password = getFormValue(formData, "password");

  if (name.length < 2 || password.length < 6 || !email.includes("@")) {
    redirect(`/login?error=${encodeURIComponent("Preencha os dados corretamente.")}`);
  }

  const existing = await db("users").where({ email }).first("id");
  if (existing) {
    redirect(`/login?error=${encodeURIComponent("Já existe um usuário com esse e-mail.")}`);
  }

  const passwordHash = await hashPassword(password);
  const role = email === env.ADMIN_EMAIL.toLowerCase() ? "admin" : "user";

  await db("users").insert({
    name,
    email,
    password_hash: passwordHash,
    role,
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/hoje",
  });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

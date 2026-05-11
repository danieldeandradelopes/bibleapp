"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUserRecord } from "@/features/auth/queries";
import { upsertUserPreferences } from "@/features/account/preferences";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { db } from "@/lib/db/knex";

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para atualizar seu perfil.");
  const name = getString(formData, "name");

  if (name.length < 2) {
    redirect("/conta?error=Informe um nome valido.");
  }

  await db("users").where({ id: user.id }).update({ name });
  revalidatePath("/conta");
  revalidatePath("/hoje");
}

export async function changePasswordAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para alterar sua senha.");
  const currentPassword = getString(formData, "currentPassword");
  const nextPassword = getString(formData, "nextPassword");

  if (currentPassword.length < 6 || nextPassword.length < 6) {
    redirect("/conta?error=As senhas devem ter pelo menos 6 caracteres.");
  }

  const userRow = await db("users")
    .select("password_hash")
    .where({ id: user.id })
    .first<{ password_hash: string }>();

  if (!userRow) {
    redirect("/conta?error=Sua conta nao foi encontrada.");
  }

  const isValid = await verifyPassword(currentPassword, userRow.password_hash);
  if (!isValid) {
    redirect("/conta?error=A senha atual esta incorreta.");
  }

  await db("users")
    .where({ id: user.id })
    .update({ password_hash: await hashPassword(nextPassword) });

  revalidatePath("/conta");
}

export async function savePreferencesAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para salvar suas preferências.");
  const reminderTime = getString(formData, "reminderTime") || "07:00";
  const reminderTimezone = getString(formData, "reminderTimezone") || "America/Sao_Paulo";
  const reminderEnabled = String(formData.get("reminderEnabled") ?? "") === "on";

  await upsertUserPreferences(user.id, {
    reminderEnabled,
    reminderTime,
    reminderTimezone,
  });

  revalidatePath("/conta");
  revalidatePath("/hoje");
}

export async function dismissOnboardingAction(): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para personalizar sua experiência.");
  await upsertUserPreferences(user.id, { onboardingCompleted: true });
  revalidatePath("/hoje");
  revalidatePath("/conta");
}

export async function promoteUserToAdminAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para administrar perfis.");
  if (user.role !== "admin") {
    redirect("/conta?error=Apenas administradores podem promover outro usuario.");
  }

  const email = getString(formData, "email").toLowerCase();
  if (!email.includes("@")) {
    redirect("/conta?error=Informe um e-mail valido para promocao.");
  }

  await db("users").where({ email }).update({ role: "admin" });
  revalidatePath("/conta");
}

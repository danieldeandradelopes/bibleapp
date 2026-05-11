"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canShareReadyMessage } from "@/features/auth/permissions";
import { requireCurrentUserRecord } from "@/features/auth/queries";
import { getTodayExperience, upsertDailyMessage } from "@/features/plans/queries";
import { db } from "@/lib/db/knex";

export async function createGroupAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para gerenciar grupos.");
  const name = String(formData.get("name") ?? "").trim();

  if (name.length < 2) {
    redirect("/grupos?error=Informe um nome válido para o grupo.");
  }

  const currentCountRow = await db("groups")
    .where({ user_id: user.id })
    .count<{ total: string }[]>("id as total")
    .first();

  await db("groups")
    .insert({
      user_id: user.id,
      name,
      sort_order: Number(currentCountRow?.total ?? 0) + 1,
      is_favorite: true,
    })
    .onConflict(["user_id", "name"])
    .ignore();

  revalidatePath("/grupos");
  revalidatePath("/hoje");
}

export async function markSharedToGroupAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para gerenciar grupos.");

  if (!canShareReadyMessage(user.role)) {
    redirect("/hoje?error=Somente admin pode registrar o compartilhamento pronto.");
  }

  const groupId = Number(formData.get("groupId"));
  if (!groupId) {
    redirect("/hoje");
  }

  const experience = await getTodayExperience(user.id);
  if (!experience) {
    redirect("/hoje?error=Não foi possível carregar a leitura do dia.");
  }

  const dailyMessageId = await upsertDailyMessage(user.id, experience);

  await db("group_share_logs")
    .insert({
      user_id: user.id,
      group_id: groupId,
      daily_message_id: dailyMessageId,
    })
    .onConflict(["group_id", "daily_message_id"])
    .ignore();

  revalidatePath("/grupos");
  revalidatePath("/hoje");
}

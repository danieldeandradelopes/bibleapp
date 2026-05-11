import "server-only";

import { getTodayExperience } from "@/features/plans/queries";
import { getStoredUserPreferences } from "@/features/account/preferences";
import { db } from "@/lib/db/knex";

export async function getReminderSummary(userId?: string | null) {
  if (!userId) return null;

  const preferences = await getStoredUserPreferences(userId);
  const today = await getTodayExperience(userId);

  if (!today) {
    return {
      enabled: preferences.reminderEnabled,
      reminderTime: preferences.reminderTime,
      reminderTimezone: preferences.reminderTimezone,
      completedCount: 0,
      totalCount: 0,
      statusLabel: "Nenhum plano ativo configurado.",
    };
  }

  const chapterIds = today.readings.flatMap((reading) => reading.chapterIds);
  const completedRows =
    chapterIds.length > 0
      ? await db("reading_progress")
          .select("chapter_id")
          .where({ user_id: userId })
          .whereIn("chapter_id", chapterIds)
      : [];

  const completedCount = completedRows.length;
  const totalCount = chapterIds.length;

  return {
    enabled: preferences.reminderEnabled,
    reminderTime: preferences.reminderTime,
    reminderTimezone: preferences.reminderTimezone,
    completedCount,
    totalCount,
    statusLabel:
      totalCount === 0
        ? "Hoje nao ha capitulos vinculados ao plano."
        : completedCount >= totalCount
          ? "Leitura do dia concluida."
          : `Faltam ${totalCount - completedCount} capitulo(s) para a leitura de hoje.`,
  };
}

export async function getAvailableAccountUsers() {
  return db("users").select("id", "name", "email", "role").orderBy("name", "asc");
}

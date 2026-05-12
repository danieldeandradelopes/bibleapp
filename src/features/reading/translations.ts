import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { getStoredUserPreferences } from "@/features/account/preferences";
import { db } from "@/lib/db/knex";
import { env } from "@/lib/env.server";

export const translationCookieName = "bibleapp.translation";

export type ActiveTranslation = {
  id: number;
  code: string;
  name: string;
};

export const getActiveTranslations = cache(async function getActiveTranslations(): Promise<ActiveTranslation[]> {
  const rows = await db("translations")
    .select("id", "code", "name")
    .where({ is_active: true })
    .orderBy("name", "asc");

  const translations = rows.map((row) => ({
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
  }));

  return translations.sort((left, right) => {
    if (left.code === env.DEFAULT_TRANSLATION_CODE) return -1;
    if (right.code === env.DEFAULT_TRANSLATION_CODE) return 1;
    return left.name.localeCompare(right.name, "pt-BR");
  });
});

export const resolvePreferredTranslation = cache(async function resolvePreferredTranslation(
  userId?: string | null,
): Promise<{
  current: ActiveTranslation | null;
  translations: ActiveTranslation[];
}> {
  const translations = await getActiveTranslations();
  const preferences = await getStoredUserPreferences(userId);
  const cookieStore = await cookies();
  const preferredCode =
    preferences.preferredTranslationCode ??
    cookieStore.get(translationCookieName)?.value ??
    env.DEFAULT_TRANSLATION_CODE;

  const current =
    translations.find((translation) => translation.code === preferredCode) ??
    translations.find((translation) => translation.code === env.DEFAULT_TRANSLATION_CODE) ??
    translations[0] ??
    null;

  return { current, translations };
});

import "server-only";

import { cache } from "react";
import { db } from "@/lib/db/knex";

export type UserPreferences = {
  preferredTranslationCode: string | null;
  reminderEnabled: boolean;
  reminderTime: string;
  reminderTimezone: string;
  onboardingCompleted: boolean;
};

export const defaultUserPreferences: UserPreferences = {
  preferredTranslationCode: null,
  reminderEnabled: false,
  reminderTime: "07:00",
  reminderTimezone: "America/Sao_Paulo",
  onboardingCompleted: false,
};

export const getStoredUserPreferences = cache(async function getStoredUserPreferences(
  userId?: string | null,
): Promise<UserPreferences> {
  if (!userId) {
    return defaultUserPreferences;
  }

  const row = await db("user_preferences")
    .select(
      "preferred_translation_code",
      "reminder_enabled",
      "reminder_time",
      "reminder_timezone",
      "onboarding_completed",
    )
    .where({ user_id: userId })
    .first<{
      preferred_translation_code: string | null;
      reminder_enabled: boolean;
      reminder_time: string;
      reminder_timezone: string;
      onboarding_completed: boolean;
    }>();

  if (!row) {
    return defaultUserPreferences;
  }

  return {
    preferredTranslationCode: row.preferred_translation_code ?? null,
    reminderEnabled: Boolean(row.reminder_enabled),
    reminderTime: String(row.reminder_time ?? defaultUserPreferences.reminderTime),
    reminderTimezone: String(row.reminder_timezone ?? defaultUserPreferences.reminderTimezone),
    onboardingCompleted: Boolean(row.onboarding_completed),
  };
});

export async function upsertUserPreferences(
  userId: string,
  values: Partial<UserPreferences>,
): Promise<void> {
  const current = await getStoredUserPreferences(userId);

  await db("user_preferences")
    .insert({
      user_id: userId,
      preferred_translation_code:
        values.preferredTranslationCode ?? current.preferredTranslationCode ?? null,
      reminder_enabled: values.reminderEnabled ?? current.reminderEnabled,
      reminder_time: values.reminderTime ?? current.reminderTime,
      reminder_timezone: values.reminderTimezone ?? current.reminderTimezone,
      onboarding_completed: values.onboardingCompleted ?? current.onboardingCompleted,
      updated_at: db.fn.now(),
    })
    .onConflict("user_id")
    .merge({
      preferred_translation_code:
        values.preferredTranslationCode ?? current.preferredTranslationCode ?? null,
      reminder_enabled: values.reminderEnabled ?? current.reminderEnabled,
      reminder_time: values.reminderTime ?? current.reminderTime,
      reminder_timezone: values.reminderTimezone ?? current.reminderTimezone,
      onboarding_completed: values.onboardingCompleted ?? current.onboardingCompleted,
      updated_at: db.fn.now(),
    });
}

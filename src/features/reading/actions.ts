"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { upsertUserPreferences } from "@/features/account/preferences";
import { requireCurrentUserRecord } from "@/features/auth/queries";
import { translationCookieName } from "@/features/reading/translations";
import { db } from "@/lib/db/knex";

export async function toggleChapterProgressAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para salvar seu progresso.");

  const chapterId = Number(formData.get("chapterId"));
  const bookId = Number(formData.get("bookId"));
  const redirectPath = String(formData.get("redirectPath") ?? "/hoje");

  if (!chapterId || !bookId) {
    redirect(redirectPath);
  }

  const existing = await db("reading_progress")
    .where({ user_id: user.id, chapter_id: chapterId })
    .first("id");

  if (existing) {
    await db("reading_progress").where({ user_id: user.id, chapter_id: chapterId }).del();
  } else {
    await db("reading_progress").insert({
      user_id: user.id,
      book_id: bookId,
      chapter_id: chapterId,
      source: "manual",
    });
  }

  revalidatePath(redirectPath);
}

export async function setPreferredTranslationAction(formData: FormData): Promise<void> {
  const translationCode = String(formData.get("translationCode") ?? "").trim().toLowerCase();
  const redirectPath = String(formData.get("redirectPath") ?? "/biblia");

  if (!translationCode) {
    redirect(redirectPath);
  }

  const cookieStore = await cookies();
  cookieStore.set(translationCookieName, translationCode, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
  });

  const session = await auth();
  if (session?.user?.id) {
    await upsertUserPreferences(session.user.id, { preferredTranslationCode: translationCode });
  }

  revalidatePath("/hoje");
  revalidatePath("/biblia");
  revalidatePath("/conta");
  revalidatePath(redirectPath);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUserRecord } from "@/features/auth/queries";
import { db } from "@/lib/db/knex";

export async function saveChapterNoteAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para salvar anotações.");

  const chapterId = Number(formData.get("chapterId"));
  const bookId = Number(formData.get("bookId"));
  const content = String(formData.get("content") ?? "").trim();
  const redirectPath = String(formData.get("redirectPath") ?? "/hoje");

  if (!chapterId || !bookId) {
    redirect(redirectPath);
  }

  const existing = await db("chapter_notes")
    .select("id")
    .where({ user_id: user.id, chapter_id: chapterId })
    .first<{ id: number }>();

  if (existing) {
    await db("chapter_notes").where({ id: existing.id }).update({
      content,
      updated_at: db.fn.now(),
    });
  } else {
    await db("chapter_notes").insert({
      user_id: user.id,
      book_id: bookId,
      chapter_id: chapterId,
      content,
    });
  }

  revalidatePath(redirectPath);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUserRecord } from "@/features/auth/queries";
import { db } from "@/lib/db/knex";

type AnnotationIntent = "highlight" | "favorite";

function parseVerseIds(value: string): number[] {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
}

export async function updateVerseSelectionAction(formData: FormData): Promise<void> {
  const user = await requireCurrentUserRecord("Faça login para salvar seus destaques.");
  const redirectPath = String(formData.get("redirectPath") ?? "/biblia");
  const verseIds = parseVerseIds(String(formData.get("verseIds") ?? ""));
  const intent = String(formData.get("intent") ?? "") as AnnotationIntent;
  const activate = String(formData.get("activate") ?? "true") === "true";

  if (verseIds.length === 0 || !["highlight", "favorite"].includes(intent)) {
    redirect(redirectPath);
  }

  const existingRows = await db("verse_annotations")
    .select("verse_id", "is_highlighted", "is_favorite")
    .where({ user_id: user.id })
    .whereIn("verse_id", verseIds);

  const existingByVerseId = new Map(
    existingRows.map((row) => [
      Number(row.verse_id),
      {
        isHighlighted: Boolean(row.is_highlighted),
        isFavorite: Boolean(row.is_favorite),
      },
    ]),
  );

  await db.transaction(async (trx) => {
    for (const verseId of verseIds) {
      const current = existingByVerseId.get(verseId) ?? {
        isHighlighted: false,
        isFavorite: false,
      };

      const next =
        intent === "highlight"
          ? {
              isHighlighted: activate,
              isFavorite: current.isFavorite,
            }
          : {
              isHighlighted: current.isHighlighted,
              isFavorite: activate,
            };

      if (!next.isHighlighted && !next.isFavorite) {
        await trx("verse_annotations").where({ user_id: user.id, verse_id: verseId }).del();
        continue;
      }

      await trx("verse_annotations")
        .insert({
          user_id: user.id,
          verse_id: verseId,
          is_highlighted: next.isHighlighted,
          is_favorite: next.isFavorite,
          updated_at: trx.fn.now(),
        })
        .onConflict(["user_id", "verse_id"])
        .merge({
          is_highlighted: next.isHighlighted,
          is_favorite: next.isFavorite,
          updated_at: trx.fn.now(),
        });
    }
  });

  revalidatePath("/salvos");
  revalidatePath(redirectPath);
}

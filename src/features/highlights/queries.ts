import "server-only";

import { resolvePreferredTranslation } from "@/features/reading/translations";
import { db } from "@/lib/db/knex";

type SavedVerseRow = {
  id: number;
  verseId: number;
  bookName: string;
  bookSlug: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  isHighlighted: boolean;
  isFavorite: boolean;
};

export async function getSavedVerses(userId?: string | null): Promise<SavedVerseRow[]> {
  if (!userId) return [];

  const { current } = await resolvePreferredTranslation(userId);

  const rows = await db("verse_annotations as va")
    .join("verses as v", "v.id", "va.verse_id")
    .join("chapters as c", "c.id", "v.chapter_id")
    .join("books as b", "b.id", "c.book_id")
    .leftJoin("verse_texts as vt", function joinTranslationText() {
      this.on("vt.verse_id", "=", "v.id");
      if (current?.id) {
        this.andOn("vt.translation_id", "=", db.raw("?", [current.id]));
      }
    })
    .select(
      "va.id",
      "va.verse_id",
      "va.is_highlighted",
      "va.is_favorite",
      "b.name as book_name",
      "b.slug as book_slug",
      "c.chapter_number",
      "v.verse_number",
      "vt.text",
    )
    .where("va.user_id", userId)
    .andWhere((builder) => builder.where("va.is_highlighted", true).orWhere("va.is_favorite", true))
    .orderBy([
      { column: "b.canonical_order", order: "asc" },
      { column: "c.chapter_number", order: "asc" },
      { column: "v.verse_number", order: "asc" },
    ]);

  return rows.map((row) => ({
    id: Number(row.id),
    verseId: Number(row.verse_id),
    bookName: String(row.book_name),
    bookSlug: String(row.book_slug),
    chapterNumber: Number(row.chapter_number),
    verseNumber: Number(row.verse_number),
    text: String(row.text ?? ""),
    isHighlighted: Boolean(row.is_highlighted),
    isFavorite: Boolean(row.is_favorite),
  }));
}

export async function getSavedVersesSummary(userId?: string | null) {
  const verses = await getSavedVerses(userId);
  return {
    totalSaved: verses.length,
    favorites: verses.filter((verse) => verse.isFavorite).length,
    highlights: verses.filter((verse) => verse.isHighlighted).length,
  };
}

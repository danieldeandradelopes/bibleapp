import type { Knex } from "knex";
import { chapterContextSeeds } from "@/lib/seed-data/chapter-contexts";

export async function upsertChapterContexts(knex: Knex): Promise<number> {
  const books = await knex("books").select("id", "slug");
  const bookIdBySlug = new Map(books.map((book) => [String(book.slug), Number(book.id)]));

  const chapterRows = await knex("chapters").select("id", "book_id", "chapter_number");
  const chapterIdByKey = new Map(
    chapterRows.map((chapter) => [
      `${Number(chapter.book_id)}:${Number(chapter.chapter_number)}`,
      Number(chapter.id),
    ]),
  );

  const rows = chapterContextSeeds
    .map((item) => {
      const bookId = bookIdBySlug.get(item.bookSlug);
      if (!bookId) return null;

      const chapterId = chapterIdByKey.get(`${bookId}:${item.chapterNumber}`);
      if (!chapterId) return null;

      return {
        chapter_id: chapterId,
        summary: item.summary,
        author: item.author,
        historical_period: item.historicalPeriod,
        audience: item.audience,
        purpose: item.purpose,
        curiosities: item.curiosities,
        source_label: item.sourceLabel ?? null,
        updated_at: knex.fn.now(),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) {
    return 0;
  }

  await knex("chapter_contexts")
    .insert(rows)
    .onConflict(["chapter_id"])
    .merge([
      "summary",
      "author",
      "historical_period",
      "audience",
      "purpose",
      "curiosities",
      "source_label",
      "updated_at",
    ]);

  return rows.length;
}
